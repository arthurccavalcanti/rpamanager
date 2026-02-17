package com.rpa.rpamanager.model.dto.processo;

import java.util.List;
import lombok.Data;

@Data
public class ProcessoResponse {
    private Long processoId;
    private String status;
    private String mensagemErro;
    private String url;
    private List<String> resultado;
}