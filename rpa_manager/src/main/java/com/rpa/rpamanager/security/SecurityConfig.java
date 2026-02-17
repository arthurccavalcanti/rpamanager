package com.rpa.rpamanager.security;

import com.rpa.rpamanager.security.service.CustomUserDetailsService;
import com.rpa.rpamanager.security.service.JWTokenService;

import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.HandlerExceptionResolver;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JWTokenService jwTokenService;
    private final CustomUserDetailsService customUserDetailsService;
    private final HandlerExceptionResolver resolver;

    public SecurityConfig(JWTokenService jwTokenService,
                          CustomUserDetailsService customUserDetailsService,
                          @Qualifier("handlerExceptionResolver")HandlerExceptionResolver resolver) {
        this.jwTokenService = jwTokenService;
        this.customUserDetailsService = customUserDetailsService;
        this.resolver = resolver;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwTokenService, customUserDetailsService, resolver);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-XSRF-TOKEN"));
        configuration.setExposedHeaders(List.of("Authorization", "X-XSRF-TOKEN"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {  
            http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))                                                
            .csrf(csrf -> csrf.disable())                       // Desativa filtro Cross-Site Request Forgery
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .anyRequest().authenticated()                    
            )
            // Filtro é inserido na cadeia antes do filtro padrão de login
            // Filtro padrão de login não é usado, pois o controller de login usa authenticationManager
            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Spring injeta configuração (criada com @EnableWebSecurity)
    // Retorna AuthenticationManager baseado no UserDetailsService e PasswordEncoder
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
/*
 @Bean faz o Spring executar o método e gerenciar retorno.
 O objeto de retorno fica disponível no contexto da aplicação.

AuthenticationManager:
    Delega autenticação para DaoAuthenticationProvider.
    Recebe um objeto de autenticação (ex. criado por UsernamePasswordAuthenticationToken).
    Chama loadUserByUsername() de CustomUserDetailsService, que acessa o BD e retorna um CustomUserDetails
    contendo o hash da senha.
    Chama matches() do PasswordEncoder para comparar senha fornecida e hash da senha.

 JwtAuthFilter: executado primeiro, autentica token e atualiza SecurityContext (ignora endpoints /auth)

 Spring Authorizantion filter: executado depois, bloqueia conexões sem o SecurityContext adequado (exceto para endpoints /auth)

  REQUESTS HTTP

  1. CORS: adiciona headers ao request
  2. JwtAuthFilter: valida token no headers e estabelece SecurityContext
  3. Spring Authorization: filtro padrão SecurityContext, path e regras de path

  REQUEST WEBSOCKET HANDSHAKE HTTP http://localhost:7777/api/ws

  1. CORS: aprova origem
  2. JwtAuthFilter: estabelece SecurityContext se tiver token válido
  3. Spring Authorization: aprova request .requestMatchers("/ws/**").permitAll()
  4. Spring WebSocket: upgrade na conexão (JSSocket e Spring mudam protocolo para ws://)
  5. Client manda frame CONNECT (com token no header) para /ws
  6. ChannelInterceptor.preSend() intercepta mensagem e atualiza header
  7. Outros filtros Spring de WebSocket veem que a mensagem está autenticada.
  */