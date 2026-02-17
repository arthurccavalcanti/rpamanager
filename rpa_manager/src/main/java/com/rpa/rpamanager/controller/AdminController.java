package com.rpa.rpamanager.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import jakarta.validation.Valid;

import com.rpa.rpamanager.model.dto.page.PageDto;
import com.rpa.rpamanager.model.dto.page.RequestPageDto;
import com.rpa.rpamanager.model.dto.processo.ProcessoDto;
import com.rpa.rpamanager.model.dto.processo.RequestProcesso;
import com.rpa.rpamanager.model.dto.rpa.RequestRPA;
import com.rpa.rpamanager.model.dto.rpa.RpaDto;
import com.rpa.rpamanager.model.dto.user.RequestChangeUserDto;
import com.rpa.rpamanager.model.dto.user.UserDto;
import com.rpa.rpamanager.service.ProcessoService;
import com.rpa.rpamanager.service.RPAService;
import com.rpa.rpamanager.service.UserService;


@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final UserService userService;
    private final ProcessoService processoService;
    private final RPAService rpaService;

    public AdminController(UserService userService, ProcessoService processoService,
                           RPAService rpaService) {
        this.userService = userService;
        this.processoService = processoService;
        this.rpaService = rpaService;
    }
    
    @PostMapping("/getUsers")
    public ResponseEntity<?> getAllUsers(@Valid @RequestBody RequestPageDto requestPageDto) {
            PageDto<UserDto> userPageDto = userService.findAllUsers(requestPageDto.getSortBy(),
                                                                    requestPageDto.getSortDir(),
                                                                    requestPageDto.getPage(),
                                                                    requestPageDto.getSize(),
                                                                    requestPageDto.getQuery());
            return ResponseEntity.ok(userPageDto);              
    }
    
    @PostMapping("/getJobs")
    public ResponseEntity<?> getAllProcessos(@Valid @RequestBody RequestPageDto requestPageDto) {
            PageDto<ProcessoDto> processoPageDto = processoService.findAllProcessos(requestPageDto.getSortBy(),
                                                                                    requestPageDto.getSortDir(),
                                                                                    requestPageDto.getPage(),
                                                                                    requestPageDto.getSize(),
                                                                                    requestPageDto.getQuery());
            return ResponseEntity.ok(processoPageDto);
    }

    @PostMapping("/getRPAs")
    public ResponseEntity<?> getAllRPAs(@Valid @RequestBody RequestPageDto requestPageDto) {    
            PageDto<RpaDto> rpaPageDtos = rpaService.findAllRpas(requestPageDto.getSortBy(),
                                                                requestPageDto.getSortDir(),
                                                                requestPageDto.getPage(),
                                                                requestPageDto.getSize(),
                                                                requestPageDto.getQuery());
            return ResponseEntity.ok(rpaPageDtos);
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUserById(@Valid @RequestParam(required = true) Long id) {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário deletado.");
    }

    @DeleteMapping("/deleteRPA")
    public ResponseEntity<?> deleteRPAById(@Valid @RequestParam(required = true) Long id) {
            rpaService.deleteRPA(id);
            return ResponseEntity.status(HttpStatus.CREATED).body("RPA deletado.");
    }

    @DeleteMapping("/deleteJob")
    public ResponseEntity<?> deleteProcessoById(@Valid @RequestParam(required = true) Long id) {
            processoService.deleteProcesso(id);
            return ResponseEntity.status(HttpStatus.CREATED).body("Processo deletado.");
    }

    @PatchMapping("/editUser")
    public ResponseEntity<?> editUser(@Valid @AuthenticationPrincipal UserDetails userDetails,
                                      @RequestBody RequestChangeUserDto requestChangeUserDto,
                                      @RequestParam(required = true) Long id) {
            userService.editUser(id, requestChangeUserDto, userDetails.getUsername());
            return ResponseEntity.ok("Usuário editado.");
    }

    @PutMapping("/editRPA")
    public ResponseEntity<?> editRPA(@Valid @RequestBody RequestRPA requestRPA,
                                     @RequestParam(required = true) Long id) {
            rpaService.editRPA(requestRPA, id);
            return ResponseEntity.ok("RPA editado.");
    }

    @PutMapping("/editJob")
    public ResponseEntity<?> editJob(@Valid @RequestBody RequestProcesso requestProcesso,
                                     @RequestParam(required = true) Long id) {
            processoService.editProcesso(requestProcesso, id);
            return ResponseEntity.ok(requestProcesso);
    }
}