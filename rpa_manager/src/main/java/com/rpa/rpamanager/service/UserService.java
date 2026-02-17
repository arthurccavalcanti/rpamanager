package com.rpa.rpamanager.service;

import com.rpa.rpamanager.exception.RpaManagerException;
import com.rpa.rpamanager.model.dto.page.PageDto;
import com.rpa.rpamanager.model.dto.user.LoginRegisterDto;
import com.rpa.rpamanager.model.dto.user.RequestChangeUserDto;
import com.rpa.rpamanager.model.dto.user.UserDto;
import com.rpa.rpamanager.model.entity.RoleName;
import com.rpa.rpamanager.model.entity.User;
import com.rpa.rpamanager.repository.UserRepository;
import com.rpa.rpamanager.utils.PageHelper;
import com.rpa.rpamanager.utils.specifications.UserSpecification;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }
    
    // CREATE
    public UserDto saveUser(LoginRegisterDto registerDto) { 
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RpaManagerException("user.alreadyExists", HttpStatus.CONFLICT);
        }
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(RoleName.USER);
        userRepository.save(user);
        return new UserDto(user.getId(), user.getUsername(), user.getRole());
    }

    // EDIT
    public void editUser(Long id, RequestChangeUserDto requestChangeUserDto,
                         String requestingUsername) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);
            User requestingUser = userRepository.findByUsername(requestingUsername).get();
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (requestingUser.equals(user)) {
                    throw new RpaManagerException("user.changeOwnRole", HttpStatus.BAD_REQUEST);
                }
                
                if (requestChangeUserDto.getRole().equals("ADMIN")) {
                    user.setRole(RoleName.ADMIN);
                } else if (requestChangeUserDto.getRole().equals("USER")) {
                    user.setRole(RoleName.USER); 
                } else {
                    throw new RpaManagerException("role.invalid", HttpStatus.BAD_REQUEST);
                }
    
                if (requestChangeUserDto.getPassword().isPresent()) {
                    user.setPassword(passwordEncoder.encode(requestChangeUserDto.getPassword().get()));
                }
                if (requestChangeUserDto.getUsername().isPresent()) {
                    if (userRepository.existsByUsername(requestChangeUserDto.getUsername().get())) {
                        throw new RpaManagerException("user.alreadyExists", HttpStatus.CONFLICT);
                    }
                    if (StringUtils.hasText(requestChangeUserDto.getUsername().get())) {
                        user.setUsername(requestChangeUserDto.getUsername().get());
                    }
                }
                userRepository.save(user);
            } else {
                throw new RpaManagerException("user.notFound", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            throw new RpaManagerException("editUser.error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RpaManagerException("user.notFound", HttpStatus.NOT_FOUND);
        }
    }

    public PageDto<UserDto> findAllUsers(Optional<String> sortBy, String sortDir, int page,
                                         int size, Optional<String> query) {
        Specification<User> spec = UserSpecification.nameContains(query);
        Page<User> users = userRepository.findAll(spec, PageHelper.getPageable(sortDir, sortBy, page, size));
        return getUserPageDto(users);
    }

    public PageDto<UserDto> getUserPageDto(Page<User> page) {
        List<UserDto> usersDto = page.getContent().stream()
                                     .map(user -> createUserDto(user)).collect(Collectors.toList());
        return new PageDto<>(usersDto, page.getNumber(), page.getSize(), page.getTotalElements(), 
                            page.getTotalPages(), page.isLast(), page.isFirst(), page.hasNext(),
                            page.hasPrevious());
    }

    public UserDto getUserByUsername(String username) {
            return userRepository.findByUsername(username)
                    .map(user -> new UserDto(user.getId(), user.getUsername(), user.getRole()))
                    .orElseThrow(() -> 
                    new RpaManagerException("user.notFound", HttpStatus.NOT_FOUND));
    }

    public UserDto createUserDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getRole());
    }

    public void resetPassword(String username, String currentPassword, String newPassword) {
        try {
            authenticationManager.authenticate(       
                new UsernamePasswordAuthenticationToken( 
                    username,
                    currentPassword
                ));
        } catch (Exception e) {
            throw new RpaManagerException("password.invalid", HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findByUsername(username).get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
