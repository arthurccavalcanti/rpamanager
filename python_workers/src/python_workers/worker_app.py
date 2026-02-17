from celery import Celery
from kombu import Exchange, Queue

JOBS_EXCHANGE = "rpa.jobs.exchange"
RPAS_EXCHANGE = "rpa.exchange"

QUEUE_RESPONSE = "rpa.jobs.response.queue"
JOB_QUEUE = "rpa.jobs.queue.a"
RPA_QUEUE = "rpa.queue"

RABBITMQ_URL = "amqp://guest:guest@localhost:5672/"

# Declarar exchange e fila
jobs_exchange = Exchange(JOBS_EXCHANGE, type='direct')
job_queue = Queue(JOB_QUEUE, exchange=jobs_exchange, routing_key='rpa.type.a')

worker_app = Celery("worker_app",
                    task_queues=([
                        job_queue
                    ]),
                    task_routes=([
                        ('execute_rpa_job', {'queue': JOB_QUEUE}),
                        ('publish_rpas', {'queue': RPA_QUEUE})
                    ]),
                    broker = RABBITMQ_URL,
                    result_backend = 'rpc://',
                    include = ['src.python_workers.tasks'],       
                    task_serializer = 'json',
                    result_serializer = 'json',
                    accept_content = ['json'],
                    task_acks_late=True,           
                    worker_prefetch_multiplier=1,
            )

