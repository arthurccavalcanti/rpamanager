package com.rpa.rpamanager.model.dto.user;

import java.util.Optional;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestChangeUserDto {
    @Pattern(regexp = "^[a-zA-Z]{4,5}$", message = "{role.invalid}")
    private String role;

    @Size(min = 6, max = 30, message = "{password.size}")
    private Optional<String> password;

    @Size(min = 5, max = 100, message = "{username.size}")
    private Optional<String> username;
}