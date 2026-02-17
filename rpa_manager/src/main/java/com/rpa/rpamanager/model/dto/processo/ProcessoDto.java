
package com.rpa.rpamanager.model.dto.processo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProcessoDto {
    private Long id;
    private String status;
    private String detalhes;
    private String url;
    private String mensagemErro;
    private Long rpaId;
    private String nomeRPA;
    private String tipoRPA;
    private String dataHoraAgendada;
    private String dataHoraInicio;
    private String dataHoraFinalizacao;
    private String resultado;
}
