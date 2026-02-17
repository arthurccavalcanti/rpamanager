package com.rpa.rpamanager.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestPasswordResetDto {
    @Size(min = 6, max = 30, message = "{password.size}")
    @NotBlank(message = "{password.notBlank}")
    private String currentPassword;
    
    @Size(min = 6, max = 30, message = "{password.size}")
    @NotBlank(message = "{password.notBlank}")
    private String newPassword;
}