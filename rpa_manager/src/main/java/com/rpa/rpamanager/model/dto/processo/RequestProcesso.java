package com.rpa.rpamanager.model.dto.processo;

import java.util.Optional;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestProcesso {
    @Size(min = 4, max = 2048, message = "{url.size}")
    private String url;

    @Positive(message = "{rpa.invalidId}")
    private Long rpaId;
    
    private Optional<String> detalhes;
}
