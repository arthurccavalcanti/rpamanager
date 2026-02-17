package com.rpa.rpamanager.security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.rpa.rpamanager.exception.InvalidJWTException;
import com.rpa.rpamanager.security.service.CustomUserDetailsService;
import com.rpa.rpamanager.security.service.JWTokenService;


// Executa uma vez para cada request
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JWTokenService jwTokenService;
    private final CustomUserDetailsService customUserDetailsService;
    @Qualifier("handlerExceptionResolver")
    private final HandlerExceptionResolver resolver;

    public JwtAuthFilter(JWTokenService j, CustomUserDetailsService u,
                        HandlerExceptionResolver h) {
        this.jwTokenService = j;
        this.customUserDetailsService = u;
        this.resolver = h;
    }

    // Extrai e valida token, determina autenticação do usuário
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req,
                                    @NonNull HttpServletResponse res,
                                    @NonNull FilterChain chain)
                                throws ServletException, IOException {

        String header = req.getHeader("Authorization");
        String token = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }    

        try {
            if (jwTokenService.validateToken(token)) {
                String username = jwTokenService.getUsernameFromToken(token);
                var customUserDetails = customUserDetailsService.loadUserByUsername(username); 

                // Credentials é null para não passar senhas para o objeto de autenticação
                var auth = new UsernamePasswordAuthenticationToken(customUserDetails, null,
                                                                customUserDetails.getAuthorities());
                    
                // Passa autenticação do usuário para contexto (thread) do request atual
                SecurityContextHolder.getContext().setAuthentication(auth);
            }  else {
                System.err.println("Usuário não autenticado.");
                throw new InvalidJWTException("token.invalid", token);
            }
        } catch (Exception e) {
            resolver.resolveException(req, res, null, e); // Passa para GlobalExceptionHandler
        }

        chain.doFilter(req, res); // Repassa request e response para próxima filtro
    }    
    
    // Filtro não é executado em endpoints que não precisam de autenticação.
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth") || path.startsWith("/api/ws");
    }
}