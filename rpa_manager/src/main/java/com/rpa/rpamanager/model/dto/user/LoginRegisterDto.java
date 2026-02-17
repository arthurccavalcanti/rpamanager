package com.rpa.rpamanager.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRegisterDto {
    @Size(min = 5, max = 100, message = "{username.size}")
    @NotBlank(message = "{username.notBlank}")
    private String username;

    @Size(min = 6, max = 30, message = "{password.size}")
    @NotBlank(message = "{password.notBlank}")
    private String password;
}