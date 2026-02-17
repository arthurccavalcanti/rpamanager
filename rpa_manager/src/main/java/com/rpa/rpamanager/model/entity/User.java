package com.rpa.rpamanager.model.entity;

import java.io.Serializable;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Usuarios")
@Data      
@NoArgsConstructor
public class User  implements Serializable {
    @Id     
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "ID_Usuario") 
    private Long id;
    
    @Column(name = "Email", unique = true, length = 255)
    private String username;

    @Column(name = "Senha", length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role")
    private RoleName role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<RPA> rpas;
}
