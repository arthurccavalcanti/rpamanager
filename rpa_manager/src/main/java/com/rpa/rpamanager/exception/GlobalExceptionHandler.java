package com.rpa.rpamanager.exception;

import java.util.HashMap;
import java.util.Map;
import jakarta.validation.ConstraintViolationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private MessageSource messageSource;

    // REQUEST BODY
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName =  ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // PATH VARIABLES/PARAMS
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintExceotions(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            errors.put(fieldName, message);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // BUSINESS RULES
    @ExceptionHandler(RpaManagerException.class)
    public ResponseEntity<String> handleRpaManagerException(RpaManagerException ex) {
        HttpStatus status = ex.getStatus();
        String messageKey = ex.getMessage();

        String message = messageSource.getMessage(messageKey, null, LocaleContextHolder.getLocale());
        return new ResponseEntity<>(message, status);
    }

    // BAD CREDENTIALS
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleRpaManagerException(BadCredentialsException ex) {
        String message = messageSource.getMessage("login.error", null, LocaleContextHolder.getLocale());
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidJWTException.class)
    public ResponseEntity<String> handleInvalidJWTException(InvalidJWTException ex) {
        String message = messageSource.getMessage("token.invalid", null, LocaleContextHolder.getLocale());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                             .header("Invalid-Token", ex.getToken())
                             .body(message);
    }

    // GENERAL EXCEPTIONS
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        System.err.println("Exceção inesperada: " + ex.getMessage());
        ex.printStackTrace();
        String message = messageSource.getMessage("general.error", null, LocaleContextHolder.getLocale());
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}