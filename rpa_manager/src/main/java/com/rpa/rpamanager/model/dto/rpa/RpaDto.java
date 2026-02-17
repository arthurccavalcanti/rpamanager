package com.rpa.rpamanager.model.dto.rpa;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

import com.rpa.rpamanager.model.dto.processo.ProcessoDto;
import com.rpa.rpamanager.model.dto.user.UserDto;

@Data
@AllArgsConstructor
public class RpaDto {
    private Long id;
    private String nomeRPA;
    private List<ProcessoDto> processos;
    private UserDto user;
    private String tipoRPA;
}