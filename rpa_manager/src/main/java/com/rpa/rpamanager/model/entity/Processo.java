package com.rpa.rpamanager.model.entity;

import java.io.Serializable;
import java.time.OffsetDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "Processos")
@Data
@NoArgsConstructor
public class Processo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Processo")
    private Long id;

    @Column(name = "Status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "RPA")
    private RPA rpa;

    @Column(name = "URL", length = 2048)
    private String url;

    @Column(name = "Detalhes", columnDefinition = "TEXT")
    private String detalhes;

    @Column(name = "Data_Hora_Agendada")
    private OffsetDateTime dataHoraAgendada;

    @Column(name = "Data_Hora_Inicio")
    private OffsetDateTime dataHoraInicio;

    @Column(name = "Data_Hora_Finalizacao")
    private OffsetDateTime dataHoraFinalizacao;

    @Column(name = "Mensagem_Erro", columnDefinition = "TEXT")
    private String mensagemErro;

    @Column(name = "Resultado", columnDefinition = "TEXT")
    private String resultado;
}