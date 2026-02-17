package com.rpa.rpamanager.model.dto.page;

import java.util.Optional;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestPageDto {
    private Optional<String> sortBy;

    @Pattern(regexp = "^[a-zA-Z]{0,4}$", message = "{page.invalidSortDir}")
    private String sortDir;

    private int page;

    @Positive(message = "{page.size}")
    private int size;
    
    private Optional<String> query;
}
