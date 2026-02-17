package com.rpa.rpamanager.service.connection;

import com.rpa.rpamanager.config.RabbitMQConfig;
import com.rpa.rpamanager.model.dto.processo.ProcessoPayload;
import com.rpa.rpamanager.utils.CeleryHeaders;
import com.rpa.rpamanager.utils.MensagemCelery;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQProducerService {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public RabbitMQProducerService(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    // Protocolo Celery: http://docs.celeryproject.org/en/latest/internals/protocol.html
    @SuppressWarnings("unchecked")
    public void enviarProcessoParaExchange(ProcessoPayload payload) {
        
        String taskId = UUID.randomUUID().toString();
        
        List<Object> args = List.of(payload.getProcessoId(), payload.getURL(),
                                    payload.getRpaName(), payload.getTipoRPA());
        MensagemCelery celeryBody = new MensagemCelery(args, Collections.emptyMap(), Collections.emptyMap());
        CeleryHeaders celeryHeaders = new CeleryHeaders(taskId, "execute_rpa_job");

        try {
            String messageBodyJson = objectMapper.writeValueAsString(celeryBody);
            
            MessageProperties messageProperties = new MessageProperties();
            messageProperties.setCorrelationId(taskId);
            messageProperties.setContentType("application/json");
            messageProperties.setContentEncoding("utf-8");
            
            messageProperties.getHeaders().putAll(
                objectMapper.convertValue(celeryHeaders, Map.class)
            );
            
            Message mensagem = new Message(messageBodyJson.getBytes(), messageProperties);

            rabbitTemplate.send(
                RabbitMQConfig.JOBS_EXCHANGE,
                RabbitMQConfig.ROUTING_KEY_A,
                mensagem
            );
            
            System.out.println("Processo #" + payload.getProcessoId() + " (Task ID: " + taskId + ") enviado para o exchange.");

        } catch (Exception e) {
            System.err.println("Erro ao enviar mensagem: " + e.getMessage());
            return;
        }
    }
}