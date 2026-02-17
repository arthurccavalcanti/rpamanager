import json
from kombu import Connection, Exchange, Queue, Producer
from .worker_app import worker_app, QUEUE_RESPONSE, JOBS_EXCHANGE, RABBITMQ_URL, RPAS_EXCHANGE, RPA_QUEUE
from uuid import uuid4
from . import getRpa
from . import loadRpas
from celery.signals import worker_ready


# Declaração de exchange e fila
routing_key_rpas = 'rpa.names'
routing_key_results = 'rpa.type.b'

results_exchange = Exchange(JOBS_EXCHANGE, type='direct')
rpa_exchange = Exchange(RPAS_EXCHANGE, type='direct')

results_queue = Queue(QUEUE_RESPONSE, exchange=JOBS_EXCHANGE,
                      routing_key=routing_key_results)
rpa_queue = Queue(RPA_QUEUE, exchange=RPAS_EXCHANGE,
                    routing_key=routing_key_rpas)

# --- EXECUTAR E PUBLICAR AUTOMAÇÃO

@worker_app.task(bind=True, name='execute_rpa_job')
def executar_job_rpa(self, processoID: int, URL: str, rpaName: str, tipoRpa: str):

    print(f"Recebido Job ID #{str(processoID)} (RPA {rpaName}, tipo {tipoRpa}) para a URL: {URL}")

    try:
        rpaFunction = getRpa.getRpaFunction(tipoRpa)
        resultado = rpaFunction(URL)
    except Exception as e:
        resultado = {"status": "ERRO",
                    "detalhes": f"{URL}",
                    "mensagem_erro": str(e),
                    "resultado": None}
    publicar_resultado(processoID, resultado)
    

def publicar_resultado(processoID: int, resultado: dict):

    mensagem = {
        "processoId": processoID,
        "status": resultado.get("status"),
        "mensagemErro": resultado.get("mensagem_erro"),
        "detalhes": resultado.get("detalhes"),
        "resultado": resultado.get("resultado")
    }

    with Connection(RABBITMQ_URL) as conn:
        producer = Producer(conn)
        producer.publish(
            json.dumps(mensagem),
            exchange=results_exchange,
            routing_key='rpa.type.b',
            serializer='json',
            content_type='application/json',
            declare=[results_queue],
            headers={'id': str(uuid4()), 'task': 'tasks.execute_rpa_job'}
        )
    print(f"Resultado para o Job ID {processoID} publicado na fila '{results_queue}'.")
    
# --- PUBLICAR TIPOS DE RPAS
@worker_ready.connect
def on_worker_ready(**kwargs):
    print("Worker pronto.")
    publish_available_rpas()

@worker_app.task(bind=True, name='publish_rpas')
def publish_available_rpas(self):

    rpas_list = loadRpas.loadRpas()

    with Connection(RABBITMQ_URL) as conn:
        producer = Producer(conn)
        producer.publish(
            json.dumps(rpas_list),
            exchange=rpa_exchange,
            routing_key=routing_key_rpas,
            serializer='json',
            content_type='application/json',
            declare=[rpa_queue],
            headers={'id': str(uuid4()), 'task': 'tasks.publish_rpas'}
        )

    print(f"Lista de RPAs enviada para exchange {rpa_exchange}, fila {rpa_queue}, routing key {routing_key_rpas}.")