package com.rpa.rpamanager.model.dto.processo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProcessoPayload {
    private Long processoId;
    private String URL;
    private String rpaName;
    private String tipoRPA;
}