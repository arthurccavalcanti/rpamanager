package com.rpa.rpamanager.exception;

public class InvalidJWTException extends RuntimeException {

    private String token;

    public InvalidJWTException(String msg, String token) {
        super(msg);
        this.token = token;
    }

    public String getToken() {  return token; }
}