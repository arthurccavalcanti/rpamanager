package com.rpa.rpamanager.controller;

import com.rpa.rpamanager.service.ProcessoService;
import com.rpa.rpamanager.service.RPAService;
import com.rpa.rpamanager.service.UserService;
import com.rpa.rpamanager.model.dto.page.PageDto;
import com.rpa.rpamanager.model.dto.page.RequestPageDto;
import com.rpa.rpamanager.model.dto.processo.ProcessoDto;
import com.rpa.rpamanager.model.dto.rpa.RpaDto;
import com.rpa.rpamanager.model.dto.user.RequestPasswordResetDto;
import com.rpa.rpamanager.model.dto.user.UserDto;

import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;


@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ProcessoService processoService;
    private final RPAService rpaService;

    public UserController(UserService userService, ProcessoService processoService,
                          RPAService rpaService) {
        this.userService = userService;
        this.processoService = processoService;
        this.rpaService = rpaService;
    }

    // Retorna UserDto do usuário
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
            UserDto userDto = userService.getUserByUsername(authentication.getName());
            return ResponseEntity.ok(userDto);
    }

    // Reset senha do usuário
    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(Authentication authentication,
                                           @Valid @RequestBody RequestPasswordResetDto requestPasswordResetDto) {
            userService.resetPassword(authentication.getName(), requestPasswordResetDto.getCurrentPassword(),
                                      requestPasswordResetDto.getNewPassword());
            return ResponseEntity.ok("Senha atualizada.");
    }
    
    // Retorna info de RPAs do usuário
    @GetMapping("/me/RPAs")
    public ResponseEntity<?> getMyRPAsData(Authentication authentication) {
            List<Map<String, Long>> rpasData = rpaService.getUsersRPAsData(authentication.getName());
            return ResponseEntity.ok(rpasData);
    }

    // Retornar processos do usuário
    @PostMapping("/jobs")
    public ResponseEntity<?> getMyProcessos(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody RequestPageDto requestPageDto) {
            PageDto<ProcessoDto> processosDto = processoService.findProcessosByUser(userDetails.getUsername(),
                                                                                    requestPageDto.getSortBy(),
                                                                                    requestPageDto.getSortDir(),
                                                                                    requestPageDto.getPage(),
                                                                                    requestPageDto.getSize(),
                                                                                    requestPageDto.getQuery());
            return ResponseEntity.ok(processosDto);
    }

    // Retornar RPAs do usuário
    @PostMapping("/RPAs")
    public ResponseEntity<?> getMyRPAs(@AuthenticationPrincipal UserDetails userDetails,
                                       @Valid @RequestBody RequestPageDto requestPageDto) {
            PageDto<RpaDto> rpaDtos = rpaService.findRpasByUsername(userDetails.getUsername(),
                                                                    requestPageDto.getSortBy(),
                                                                    requestPageDto.getSortDir(),
                                                                    requestPageDto.getPage(),
                                                                    requestPageDto.getSize(),
                                                                    requestPageDto.getQuery());
            return ResponseEntity.ok(rpaDtos);
    }
}
