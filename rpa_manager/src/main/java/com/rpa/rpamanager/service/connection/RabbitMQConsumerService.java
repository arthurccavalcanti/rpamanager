package com.rpa.rpamanager.service.connection;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rpa.rpamanager.config.RabbitMQConfig;
import com.rpa.rpamanager.model.dto.processo.ProcessoResponse;
import com.rpa.rpamanager.repository.ProcessoRepository;
import com.rpa.rpamanager.service.ProcessoService;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQConsumerService {

    private final ProcessoRepository processoRepository;
    private final ObjectMapper objectMapper;
    private final ProcessoService processoService;
    private final NotificationService notificationService;
    private final RpaCacheService rpaCacheService;

    public RabbitMQConsumerService(ProcessoRepository processoRepository,
                                   ObjectMapper objectMapper,
                                   ProcessoService processoService,
                                   NotificationService notificationService,
                                   RpaCacheService rpaCacheService) {
        this.processoRepository = processoRepository;
        this.objectMapper = objectMapper;
        this.processoService = processoService;
        this.notificationService = notificationService;
        this.rpaCacheService = rpaCacheService;
    }

    @RabbitListener(queues = RabbitMQConfig.JOB_RESPONSE_QUEUE)
    public void receberProcessoResponse(Message message) {
        try {
            byte[] body = message.getBody();
            ProcessoResponse response = objectMapper.readValue(body, ProcessoResponse.class);
            System.out.println("Processo recebido: " + response.getProcessoId());

            processoRepository.findById(response.getProcessoId())
                .ifPresent(processo -> {
                    processo.setStatus(response.getStatus());
                    processo.setDataHoraFinalizacao(OffsetDateTime.now());
                    if (response.getResultado() != null) {
                        processo.setResultado(String.valueOf(response.getResultado()));
                    }
                    if ("ERRO".equals(response.getStatus())) {
                        processo.setMensagemErro(response.getMensagemErro());
                    }
                    processoRepository.save(processo);
                    System.out.println("Processo #" + processo.getId() + " atualizado no banco de dados.");
                    notificationService.sendUpdate(processoService.createProcessoDto(processo));
                });
        } catch (Exception e) {
            System.err.println("Erro ao processar mensagem da fila de resposta: " + e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.RPA_QUEUE)
    public void receberListaRpas(Message message) {
        try {
            MessageProperties messageProperties = message.getMessageProperties();
            String contentEncoding = messageProperties.getContentEncoding();
            byte[] body = message.getBody();
            String decodedBody;
            if (contentEncoding != null) {
                decodedBody = new String(body, contentEncoding);
            } else {
                decodedBody = new String(body, StandardCharsets.UTF_8); 
            }
            if (decodedBody == null || decodedBody.trim().isEmpty()) {
                System.err.println("Sem RPAs disponíveis.");
                return;
            }
            List<String> rpaList = Arrays.asList(decodedBody.split(","));
            rpaCacheService.updateRpaList(rpaList);
        } catch (Exception e) {
            System.err.println("Erro ao receber lista de RPAs: " + e.getMessage());
            e.printStackTrace();
        }
    }
}



  