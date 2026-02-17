package com.rpa.rpamanager.model.dto.user;

import com.rpa.rpamanager.model.entity.RoleName;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private RoleName role;
}