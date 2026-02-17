package com.rpa.rpamanager.service.connection;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.rpa.rpamanager.model.dto.processo.ProcessoDto;
import com.rpa.rpamanager.model.entity.RPA;
import com.rpa.rpamanager.repository.RPARepository;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final RPARepository rpaRepository;

    public NotificationService(SimpMessagingTemplate messagingTemplate,
                               RPARepository rpaRepository) {
        this.messagingTemplate = messagingTemplate;
        this.rpaRepository = rpaRepository;
    }

    public void sendUpdate(ProcessoDto processoDto) {
        RPA rpa = rpaRepository.findById(processoDto.getRpaId()).get();
        String username = rpa.getUser().getUsername().toString();
        messagingTemplate.convertAndSendToUser(username,
                                               "/queue/updates",
                                               processoDto);
        System.out.println("Update enviado ao usuário " + username);
    }
}