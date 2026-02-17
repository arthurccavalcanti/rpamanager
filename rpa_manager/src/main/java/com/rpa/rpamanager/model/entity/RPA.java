package com.rpa.rpamanager.model.entity;

import java.io.Serializable;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "RPAs")
@Data
@NoArgsConstructor
public class RPA implements Serializable {

    @Id     
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "ID_RPA") 
    private Long id;
    
    @Column(name = "Nome_RPA", unique = true, length = 255)
    private String nomeRPA;

    @OneToMany(mappedBy = "rpa", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Processo> processos;

    @ManyToOne
    @JoinColumn(name = "Usuario")
    private User user;

    @Column(name = "Tipo_RPA", length = 255)
    private String tipoRPA;
}
