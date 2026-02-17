package com.rpa.rpamanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import jakarta.validation.Valid;

import com.rpa.rpamanager.service.UserService;
import com.rpa.rpamanager.model.dto.user.LoginRegisterDto;
import com.rpa.rpamanager.model.dto.user.UserDto;
import com.rpa.rpamanager.security.service.JWTokenService;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JWTokenService jwTokenService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JWTokenService jwTokenService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwTokenService = jwTokenService;
        this.userService = userService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> cadastrarUsuario(@Valid @RequestBody LoginRegisterDto registerDto) {
            UserDto userDto = userService.saveUser(registerDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRegisterDto loginDto) {
            authenticationManager.authenticate(       
                new UsernamePasswordAuthenticationToken( 
                    loginDto.getUsername(),
                    loginDto.getPassword()
                ));
            String token = jwTokenService.generateToken(loginDto.getUsername());
            return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(userService.getUserByUsername(loginDto.getUsername()));
    }
}
