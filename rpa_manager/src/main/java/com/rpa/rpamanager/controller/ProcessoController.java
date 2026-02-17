package com.rpa.rpamanager.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.validation.Valid;
import java.util.List;

import com.rpa.rpamanager.service.ProcessoService;
import com.rpa.rpamanager.service.RPAService;
import com.rpa.rpamanager.model.dto.processo.RequestProcesso;
import com.rpa.rpamanager.model.dto.rpa.RequestRPA;


@RestController
@RequestMapping("/RPA")
public class ProcessoController {

    private final ProcessoService processoService;
    private final RPAService rpaService;

    public ProcessoController(ProcessoService processoService, RPAService rpaService) {
        this.processoService = processoService;
        this.rpaService = rpaService;
    }

    // Criar novo processo
    @PostMapping("/createJob")
    public ResponseEntity<?> createProcesso(@Valid @RequestBody RequestProcesso requestProcesso,
                                            @AuthenticationPrincipal UserDetails userDetails) {
            processoService.saveProcesso(requestProcesso, userDetails.getUsername(), requestProcesso.getRpaId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Processo criado!");
    }

    // Criar novo RPA
    @PostMapping("/createRPA")
    public ResponseEntity<?> createRPA(@Valid @RequestBody RequestRPA requestRPA,
                                       @AuthenticationPrincipal UserDetails userDetails) {
            rpaService.saveRPA(requestRPA, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body("RPA criado!");
    }

    // Editar RPA
    @PutMapping("/editRPA")
    public ResponseEntity<?> editUserRPA(@Valid @RequestBody RequestRPA requestRPA,
                                         @RequestParam(required = true) Long id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
            rpaService.editUserRPA(requestRPA, id, userDetails.getUsername());
            return ResponseEntity.ok("RPA editado.");
    }

    // Editar processo
    @PutMapping("/editJob")
    public ResponseEntity<?> editUserJob(@Valid @RequestBody RequestProcesso requestProcesso,
                                         @RequestParam(required = true) Long id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
            processoService.editUserProcesso(requestProcesso, id, userDetails.getUsername());
            return ResponseEntity.ok("Processo editado.");
    }

    // Deletar RPA
    @DeleteMapping("/deleteRPA")
    public ResponseEntity<?> deleteRPAById(@Valid @RequestParam(required = true) Long id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
            rpaService.deleteUserRPA(id, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body("RPA deletado.");
    }

    // Deletar processo
    @DeleteMapping("/deleteJob")
    public ResponseEntity<?> deleteProcessoById(@Valid @RequestParam(required = true) Long id,
                                                @AuthenticationPrincipal UserDetails userDetails) {
            processoService.deleteUserProcesso(id, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body("Processo deletado.");
    }

    // Retorna tipos de RPA disponíveis
    @GetMapping("/types")
    public ResponseEntity<?> getRpaTypes() {
        List<String> rpaTypes = rpaService.findAvailableRpaTypes();
        return ResponseEntity.ok(rpaTypes);
    }
}