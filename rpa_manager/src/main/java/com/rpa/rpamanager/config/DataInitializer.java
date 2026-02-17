package com.rpa.rpamanager.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.rpa.rpamanager.model.entity.RoleName;
import com.rpa.rpamanager.model.entity.User;
import com.rpa.rpamanager.repository.UserRepository;

// (CommandLineRunner -> executa Bean imediatamente)
@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        User admin = new User();
        admin.setUsername("admin@admin.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(RoleName.ADMIN);
        
        User user = new User();
        user.setUsername("user@user.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole(RoleName.USER);
        
        if (!userRepository.existsByUsername("admin@admin.com")) {
            userRepository.save(admin);
        }
        if (!userRepository.existsByUsername("user@user.com")) {
            userRepository.save(user);
        }
    }
}
