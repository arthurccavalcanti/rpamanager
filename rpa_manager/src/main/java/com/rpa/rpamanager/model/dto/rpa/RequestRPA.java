package com.rpa.rpamanager.model.dto.rpa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestRPA {
    @Size(min = 5, max = 100, message = "{rpa.size}")
    @NotBlank(message = "{rpa.notBlank}")
    private String nomeRPA;

    @Size(min = 2, max = 100, message = "{rpa.type.size}")
    @NotBlank(message = "{rpa.type.notBlank}")
    private String tipoRPA;
}