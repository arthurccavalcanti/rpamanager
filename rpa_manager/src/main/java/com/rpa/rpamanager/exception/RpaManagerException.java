package com.rpa.rpamanager.exception;

import org.springframework.http.HttpStatus;

public class RpaManagerException extends RuntimeException {

    private HttpStatus status;

    public RpaManagerException(String msg, HttpStatus status) {
        super(msg);
        this.status = status;
    }

    public HttpStatus getStatus() {  return status; }
}