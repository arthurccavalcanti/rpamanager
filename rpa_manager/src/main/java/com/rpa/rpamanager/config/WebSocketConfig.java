package com.rpa.rpamanager.config;

import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.Ordered;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import com.rpa.rpamanager.security.service.JWTokenService;
import com.rpa.rpamanager.security.service.CustomUserDetailsService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99) // Intercepta antes do Spring Security
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JWTokenService jwTokenService;
    private final CustomUserDetailsService customUserDetailsService;

    public WebSocketConfig(JWTokenService jwTokenService,
                           CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwTokenService = jwTokenService;
    }

    // Endpoint do handshake http://localhost:7777/api/ws
    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:5173").withSockJS();
    }

    // Roteia mensagems para inscritos em user/queue/*
    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(@NonNull ChannelRegistration registration) {

        registration.interceptors(new ChannelInterceptor() {
            @SuppressWarnings("null")
            @Override
            public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
                                        
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor == null) {
                    System.err.println("Não foi possível acessar o cabeçalho.");
                    return null;
                }

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> authorization = accessor.getNativeHeader("Authorization");
                    if (authorization == null || authorization.isEmpty()) {
                        System.err.println("Usuário não tem token.");
                        return null;
                    }
                    String authHeader = authorization.get(0);
                    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        System.err.println("Token não tem formato correto.");
                        return null;
                    }
                    String jwt = authHeader.substring(7);
                    if (!jwTokenService.validateToken(jwt)) {
                        System.err.println("Token é inválido.");
                        return null;
                    }
                    String username = jwTokenService.getUsernameFromToken(jwt);
                    if (username == null) {
                        System.err.println("Claims não tem usuário.");
                        return null;
                    }
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    accessor.setUser(authToken);
                    System.out.println("Usuário " + username + " conectado.");
                    return message;
                } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    System.out.println("Usuário " + accessor.getUser().getName() + 
                                       " se inscreveu em: " + accessor.getDestination());
                    return message;
                }
                return null;
            }
        });
    }
}

/*
 1. Todos os destinos que começam com /user são específicos a um usuário
    (registry.setUserDestinationPrefix("/user"))

 2. Client se inscreve em user/queue/updates

 3. Ao receber a inscrição, o broker combina
    /user + principal autenticado do usuário [em accessor.setUser()] + queue/updates

 4. A fila privada é mantida até a conexão encerrar ou o token não ser mais válido

 5. Broker procura fila privada a partir do nome e envia mensagem
    messagingTemplate.convertAndSendToUser("user1", "/queue/updates", message)

 SPRING WEBSOCKET

 A. SubProtocolWebSocketHandler recebe mensagem CONNECT com principal no headers
 B. UserSessionRegistry mapeia usuário a set de sessões WebSocket: Map<String, Set<String>> 
 C. SimpMessagingTemplate.convertAndSendToUser() usa String username para achar sessões no registro

 UserDetails é o principal em UsernamePasswordAuthenticationToken,
  que é passado para o headers da mensagem em accessor.setUser(authToken);
 A String do principal e a usada em convertAndSendToUser() devem ser iguais.

 - Message é um container com payload e headers
 - Message Accessor é um wrapper que dá acesso aos headers usando tipagem forte
 - Stomp Accessor dá acesso a headers de STOMP

 - getNativeHeader retorna uma lista porque o header pode conter vários valores
   (no nosso caso, é uma lista com só um item [Bearer <token>])

 - Todas as mensagens STOMP (pelo canal ClientInboundChannel) passam pelo interceptor (ChannelInterceptor)

 - accessor.setUser(authToken) põe identidade no headers

 - SecurityContext é thread local, e conexão WebSocket pode usar outras threads.
   UserSessionRegistry do Spring liga o user principal no header à sessão WebSocket.
   Assim, a identidade do usuário permanece ligada à conexão, mesmo se outra thread for responsável
   pelo processamento.

 - MessageChannel (i.e clientInboundChannel) manda a mensagem para o handler/próximo interceptor

 */