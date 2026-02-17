package com.rpa.rpamanager.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.rpa.rpamanager.exception.RpaManagerException;
import com.rpa.rpamanager.model.dto.page.PageDto;
import com.rpa.rpamanager.model.dto.processo.ProcessoDto;
import com.rpa.rpamanager.model.dto.rpa.RequestRPA;
import com.rpa.rpamanager.model.dto.rpa.RpaDto;
import com.rpa.rpamanager.model.dto.user.UserDto;
import com.rpa.rpamanager.model.entity.RPA;
import com.rpa.rpamanager.model.entity.User;
import com.rpa.rpamanager.repository.RPARepository;
import com.rpa.rpamanager.repository.UserRepository;
import com.rpa.rpamanager.service.connection.RpaCacheService;
import com.rpa.rpamanager.utils.PageHelper;
import com.rpa.rpamanager.utils.specifications.RPASpecification;

@Service
public class RPAService {

    private final RPARepository rpaRepository;
    private final UserRepository userRepository;
    private final ProcessoService processoService;
    private final RpaCacheService rpaCacheService;

    public RPAService(RPARepository rpaRepository, UserRepository userRepository,
                      ProcessoService processoService, RpaCacheService rpaCacheService) {
        this.rpaRepository = rpaRepository;
        this.userRepository = userRepository;
        this.processoService = processoService;
        this.rpaCacheService = rpaCacheService;
    }

    // CRIAR
    public void saveRPA(RequestRPA requestRPA, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> 
                        new RpaManagerException("user.notFound", HttpStatus.NOT_FOUND));
        if (rpaRepository.existsByNomeRPA(requestRPA.getNomeRPA())) {
            throw new RpaManagerException("rpa.alreadyExists", HttpStatus.BAD_REQUEST);
        }
        if (!findAvailableRpaTypes().contains(requestRPA.getTipoRPA())) {
            throw new RpaManagerException("rpa.type.notAvailable", HttpStatus.BAD_REQUEST);
        }               
        RPA novoRPA = new RPA();
        novoRPA.setUser(user);
        novoRPA.setNomeRPA(requestRPA.getNomeRPA());
        novoRPA.setTipoRPA(requestRPA.getTipoRPA());
        rpaRepository.save(novoRPA);
    }

    // EDITAR (ADMIN)
    public void editRPA(RequestRPA requestRPA, Long id) {
        if (!rpaRepository.existsById(id)) {
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND);
        }
        boolean isNameTheSame = (rpaRepository.findById(id).get().getNomeRPA().equals(requestRPA.getNomeRPA()));
        if (rpaRepository.existsByNomeRPA(requestRPA.getNomeRPA()) && !isNameTheSame) {
            throw new RpaManagerException("rpa.alreadyExists", HttpStatus.CONFLICT);
        }
        if (!findAvailableRpaTypes().contains(requestRPA.getTipoRPA())) {
            throw new RpaManagerException("rpa.type.notAvailable", HttpStatus.BAD_REQUEST);
        }   
        RPA rpaEdit = rpaRepository.getReferenceById(id);
        rpaEdit.setNomeRPA(requestRPA.getNomeRPA());
        rpaEdit.setTipoRPA(requestRPA.getTipoRPA());
        rpaRepository.save(rpaEdit);
    }

    // EDITAR (USER)
    public void editUserRPA(RequestRPA requestRPA, Long id, String username) {
        if (!rpaRepository.existsById(id)) {
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND);
        }
        boolean isNameTheSame = (rpaRepository.findById(id).get().getNomeRPA().equals(requestRPA.getNomeRPA()));           
        if (rpaRepository.existsByNomeRPA(requestRPA.getNomeRPA()) && !isNameTheSame) {
            throw new RpaManagerException("rpa.alreadyExists", HttpStatus.CONFLICT);
        }
        if (!findAvailableRpaTypes().contains(requestRPA.getTipoRPA())) {
            throw new RpaManagerException("rpa.type.notAvailable", HttpStatus.BAD_REQUEST);
        }   
        User rpaUser = rpaRepository.findById(id).get().getUser();
        if (!rpaUser.equals(userRepository.findByUsername(username).get())) {
            // Usuário não é dono do RPA especificado.
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND); 
        } else {
            RPA rpaEdit = rpaRepository.getReferenceById(id);
            if (!isNameTheSame) {
                rpaEdit.setNomeRPA(requestRPA.getNomeRPA()); 
            }
            rpaEdit.setTipoRPA(requestRPA.getTipoRPA());
            rpaRepository.save(rpaEdit);
        }
    }

    // DELETAR (ADMIN)
    public void deleteRPA(Long id) {
        if (rpaRepository.existsById(id)) {
            rpaRepository.deleteById(id);
        } else {
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND);
        }
    }

    // DELETAR (USER)
    public void deleteUserRPA(Long id, String username) {
        if (!rpaRepository.existsById(id)) {
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND);
        }
        User userRPa = rpaRepository.findById(id).get().getUser();
        if (!userRPa.equals(userRepository.findByUsername(username).get())) {
            // Usuário não é dono do RPA.
            throw new RpaManagerException("rpa.notFound", HttpStatus.NOT_FOUND); 
        } else {
            rpaRepository.deleteById(id);
        }
    }

    public Long findRpaIdByName(String rpaName) {
        return rpaRepository.findByNomeRPA(rpaName).getId();
    }

    public PageDto<RpaDto> findRpasByUsername(String username, Optional<String> sortBy,
                                              String sortDir, int page,
                                              int size, Optional<String> query)  {
        User user = userRepository.findByUsername(username).orElseThrow(() -> 
                        new RpaManagerException("user.notFound", HttpStatus.NOT_FOUND));
        Specification<RPA> spec = RPASpecification.hasUserIdAndContainsQuery(user.getId(), query);                                              
        Page<RPA> rpas = rpaRepository.findAll(spec, PageHelper.getPageable(sortDir, sortBy, page, size));
        return getRpaPageDto(rpas);
    }

    public PageDto<RpaDto> findAllRpas(Optional<String> sortBy, String sortDir,
                                       int page, int size, Optional<String> query) {
        Specification<RPA> spec = RPASpecification.containsQuery(query);
        Page<RPA> rpas = rpaRepository.findAll(spec, PageHelper.getPageable(sortDir, sortBy, page, size));
        return getRpaPageDto(rpas);
    }

    public PageDto<RpaDto> getRpaPageDto(Page<RPA> page) {
        List<RpaDto> rpaDtos = page.getContent().stream()
                                     .map(rpa -> createRpaDto(rpa)).collect(Collectors.toList());
        return new PageDto<>(rpaDtos, page.getNumber(), page.getSize(), page.getTotalElements(), 
                            page.getTotalPages(), page.isLast(), page.isFirst(), page.hasNext(),
                            page.hasPrevious());
    }

    public RpaDto createRpaDto(RPA rpa) {
        List<ProcessoDto> processos = rpa.getProcessos().stream()
                                            .map(processo -> processoService.createProcessoDto(processo))
                                            .collect(Collectors.toList());
        UserDto user = new UserDto(rpa.getUser().getId(),
                                    rpa.getUser().getUsername(),
                                    rpa.getUser().getRole());

        return new RpaDto(rpa.getId(), rpa.getNomeRPA(), processos, user, rpa.getTipoRPA());
    }

    public List<Map<String, Long>> getUsersRPAsData(String username) {
        List<RPA> userRPAs = rpaRepository.findByUser_Username(username);
        List<Map<String, Long>> rpasData = new ArrayList<>();
        for (RPA userRpa: userRPAs) {
            Map<String, Long> rpaMap = new HashMap<>();
            rpaMap.put(userRpa.getNomeRPA(), userRpa.getId());
            rpasData.add(rpaMap);
        }
        return rpasData;
    }

    public List<String> findAvailableRpaTypes() {
        List<String> availableRpas = rpaCacheService.getRpaList();
        if (availableRpas.isEmpty()) {
            throw new RpaManagerException("rpa.unavailable", HttpStatus.NOT_FOUND);
        } else {
            return availableRpas;
        }
    }
}