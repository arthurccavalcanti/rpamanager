package com.rpa.rpamanager.service;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.rpa.rpamanager.exception.RpaManagerException;
import com.rpa.rpamanager.model.dto.page.PageDto;
import com.rpa.rpamanager.model.dto.processo.ProcessoDto;
import com.rpa.rpamanager.model.dto.processo.ProcessoPayload;
import com.rpa.rpamanager.model.dto.processo.RequestProcesso;
import com.rpa.rpamanager.model.entity.Processo;
import com.rpa.rpamanager.model.entity.RPA;
import com.rpa.rpamanager.model.entity.User;
import com.rpa.rpamanager.repository.ProcessoRepository;
import com.rpa.rpamanager.repository.RPARepository;
import com.rpa.rpamanager.repository.UserRepository;
import com.rpa.rpamanager.service.connection.RabbitMQProducerService;
import com.rpa.rpamanager.utils.PageHelper;
import com.rpa.rpamanager.utils.specifications.ProcessoSpecification;

@Service
public class ProcessoService {

    private final ProcessoRepository processoRepository;
    private final UserRepository userRepository;
    private final RPARepository rpaRepository;
    private final RabbitMQProducerService RabbitMQProducerService;

    public ProcessoService(ProcessoRepository processoRepository,
                           UserRepository userRepository,
                           RPARepository rpaRepository,
                           RabbitMQProducerService RabbitMQProducerService) {
        this.processoRepository = processoRepository;
        this.userRepository = userRepository;
        this.rpaRepository = rpaRepository;
        this.RabbitMQProducerService = RabbitMQProducerService;
    }

    // CRIAR
    public void saveProcesso(RequestProcesso requestProcesso, String username, Long rpaId) {
        User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RpaManagerException("user.NotFound", HttpStatus.NOT_FOUND));
        RPA rpa = rpaRepository.findById(rpaId)
                        .filter(rpaEncontrado -> rpaEncontrado.getUser().equals(user))
                        .orElseThrow(() -> new RpaManagerException("rpa.NotFound", HttpStatus.NOT_FOUND));
        Processo processo = new Processo();
        processo.setStatus("PENDENTE");
        processo.setDataHoraAgendada(OffsetDateTime.now());
        processo.setUrl(requestProcesso.getUrl());
        processo.setRpa(rpa);
        processoRepository.save(processo);
        enviarProcesso(processo);
    }

    // ENVIAR PRO EXCHANGE
    public void enviarProcesso(Processo processo) {
        System.out.println("Enviando processo #" + processo.getId());
        processo.setStatus("EM ANDAMENTO");
        processo.setDataHoraInicio(OffsetDateTime.now());
        processoRepository.save(processo);

        ProcessoPayload payload = ProcessoPayload.builder()
                                    .processoId(processo.getId())
                                    .URL(processo.getUrl())
                                    .rpaName(processo.getRpa().getNomeRPA())
                                    .tipoRPA(processo.getRpa().getTipoRPA())
                                    .build();
        System.out.println("Enviando processo: " + processo.getId());
        System.out.println("Payload: " + payload.toString());
        RabbitMQProducerService.enviarProcessoParaExchange(payload);
    }

    // EDITAR (ADMIN)
    public void editProcesso(RequestProcesso requestProcesso, Long id) {
        if (!processoRepository.existsById(id)) {
            throw new RpaManagerException("processo.notFound", HttpStatus.NOT_FOUND);
        }
        if (!rpaRepository.existsById(requestProcesso.getRpaId())) {
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND);
        }
        Processo processoEdit = processoRepository.getReferenceById(id);
        processoEdit.setUrl(requestProcesso.getUrl());
        processoEdit.setRpa(rpaRepository.findById(requestProcesso.getRpaId()).get());
        processoEdit.setDetalhes(
            (requestProcesso.getDetalhes().isPresent())
            ? requestProcesso.getDetalhes().get() : null
            );
        processoRepository.save(processoEdit);
    }

    // EDITAR (USER)
    public void editUserProcesso(RequestProcesso requestProcesso, Long id, String username)  {
        if (!processoRepository.existsById(id)) {
            throw new RpaManagerException("processo.notFound", HttpStatus.NOT_FOUND);
        }
        if (!rpaRepository.existsById(requestProcesso.getRpaId())) {
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND);
        }
        User processoUser = processoRepository.findById(id).get().getRpa().getUser();
        if (processoUser.equals(userRepository.findByUsername(username).get())) {
            Processo processoEdit = processoRepository.getReferenceById(id);
            processoEdit.setUrl(requestProcesso.getUrl());
            processoEdit.setRpa(rpaRepository.findById(requestProcesso.getRpaId()).get());
            processoEdit.setDetalhes(
                (requestProcesso.getDetalhes().isPresent())
                ? requestProcesso.getDetalhes().get() : null
            );
            processoRepository.save(processoEdit);
        } else {
            // Usuário não é dono do processo.
            throw new RpaManagerException("processo.notFound", HttpStatus.NOT_FOUND); 
        }
    }

    // DELETAR (ADMIN)
    public void deleteProcesso(Long id) {
        if (processoRepository.existsById(id)) {
            processoRepository.deleteById(id);
        }
        else {
            throw new RpaManagerException("processo.notFound", HttpStatus.NOT_FOUND);
        }
    }

    // DELETAR (USER)
    public void deleteUserProcesso(Long id, String username) {
        if (!processoRepository.existsById(id)) {
            throw new RpaManagerException("processo.notFound", HttpStatus.NOT_FOUND);
        }
        User userProcesso = processoRepository.findById(id).get().getRpa().getUser();
        if (!userProcesso.equals(userRepository.findByUsername(username).get())) {
            // Usuário não é dono do processo.
            throw new RpaManagerException("processo.notFound", HttpStatus.NOT_FOUND); 
        } else {
            processoRepository.deleteById(id);
        }
    }

    public PageDto<ProcessoDto> findAllProcessos(Optional<String> sortBy, String sortDir,
                                                 int page, int size, Optional<String> query) {
        Specification<Processo> spec = ProcessoSpecification.containsQuery(query);
        Page<Processo> processos = processoRepository.findAll(spec, PageHelper.getPageable(sortDir, sortBy, page, size));
        return getProcessoPageDto(processos);
    }

    public PageDto<ProcessoDto> findProcessosByUser(String username, Optional<String> sortBy,
                                                    String sortDir, int page, int size,
                                                    Optional<String> query)  {
        User user = userRepository.findByUsername(username)
                                            .orElseThrow(() -> new RpaManagerException("user.notFound", HttpStatus.NOT_FOUND));
        Specification<Processo> spec = ProcessoSpecification.hasUserIdAndContainsQuery(user.getId(), query);
        Page<Processo> processos = processoRepository.findAll(spec, PageHelper.getPageable(sortDir, sortBy, page, size));
        return getProcessoPageDto(processos);
    }

    public PageDto<ProcessoDto> getProcessoPageDto(Page<Processo> page) {
        List<ProcessoDto> processoDtos = page.getContent().stream()
                                        .map(processo -> createProcessoDto(processo))
                                        .collect(Collectors.toList());
        return new PageDto<>(processoDtos, page.getNumber(), page.getSize(), page.getTotalElements(), 
                             page.getTotalPages(), page.isLast(), page.isFirst(), page.hasNext(),
                             page.hasPrevious());
    }
    
    public ProcessoDto createProcessoDto(Processo processo) {

        String datahoraAgendada = (processo.getDataHoraAgendada() != null)
                                    ? processo.getDataHoraAgendada().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                                    : null;
        String dataHoraInicio = (processo.getDataHoraInicio() != null)
                                    ? processo.getDataHoraAgendada().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                                    : null;
        String dataHoraFinalizacao =  (processo.getDataHoraFinalizacao() != null)
                                        ? processo.getDataHoraAgendada().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                                        : null;
        return new ProcessoDto(processo.getId(),
                               processo.getStatus(),
                               processo.getDetalhes(),
                               processo.getUrl(),
                               processo.getMensagemErro(),
                               processo.getRpa().getId(),
                               rpaRepository.findById(processo.getRpa().getId()).get().getNomeRPA(),
                               rpaRepository.findById(processo.getRpa().getId()).get().getTipoRPA(),
                               datahoraAgendada,
                               dataHoraInicio,
                               dataHoraFinalizacao,
                               processo.getResultado());
    }
}