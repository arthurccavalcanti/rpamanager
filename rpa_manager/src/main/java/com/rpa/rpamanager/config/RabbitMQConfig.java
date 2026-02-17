package com.rpa.rpamanager.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;

@Configuration
public class RabbitMQConfig {

    public static final String JOBS_EXCHANGE = "rpa.jobs.exchange";
    public static final String RPAS_EXCHANGE = "rpa.exchange";

    public static final String RPA_QUEUE = "rpa.queue";
    public static final String ROUTING_KEY_RPA = "rpa.names";

    public static final String JOB_QUEUE_A = "rpa.jobs.queue.a";
    public static final String ROUTING_KEY_A = "rpa.type.a";

    public static final String JOB_RESPONSE_QUEUE = "rpa.jobs.response.queue";
    public static final String ROUTING_KEY_B = "rpa.type.b";

    // EXCHANGES
    @Bean
    public DirectExchange jobsExchange() {
        return new DirectExchange(JOBS_EXCHANGE);
    }

    @Bean
    public DirectExchange rpasExchange() {
        return new DirectExchange(RPAS_EXCHANGE);
    }

    // QUEUES
    @Bean
    public Queue jobQueueA() {
        return new Queue(JOB_QUEUE_A, true);
    }
    
    @Bean
    public Queue jobResponseQueue() {
        return new Queue(JOB_RESPONSE_QUEUE, true);
    }

    @Bean
    public Queue rpaQueue() {
        return new Queue(RPA_QUEUE, true);
    }

    // BINDINGS
    @Bean
    public Binding bindingA(DirectExchange jobsExchange, Queue jobQueueA) {
        return BindingBuilder.bind(jobQueueA).to(jobsExchange).with(ROUTING_KEY_A);
    }

    @Bean
    public Binding bindingB(DirectExchange jobsExchange, Queue jobResponseQueue) {
        return BindingBuilder.bind(jobResponseQueue).to(jobsExchange).with(ROUTING_KEY_B);
    }

    @Bean
    public Binding bindingRPA(DirectExchange rpasExchange, Queue rpaQueue) {
        return BindingBuilder.bind(rpaQueue).to(rpasExchange).with(ROUTING_KEY_RPA);
    }

    // MESSAGE
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}

/*
 ConnectionFactory: objeto de conexão com o server RabbitMQ (contém porta, host, user, senha)

 RabbitTemplate: classe auxiliar para enviar mensagems pelo protocolo AMQP

 Exchange direto: mensagem é enviada para fila cuja chave corresponde com a chave de roteamento

 Durable: persistem até serem deletadas, metadados são salvos em disco

 MessageConverter: (de)serializa JSON, ProcessoPayload (objeto java) -> JSON string

 Exchange faz roteamento para filas adequadas.

 Binding: mensagens com chave A enviadas ao exchange são encaminhadas para a fila A
 */