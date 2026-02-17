package com.rpa.rpamanager.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class CeleryHeaders {

    @JsonProperty("task")
    private final String task;

    @JsonProperty("id")
    private final String id; 

    @JsonProperty("lang")
    private final String lang = "py";

    public CeleryHeaders(String taskId, String taskName) {
        this.id = taskId;
        this.task = taskName;
    }

    public String getTask() { return task; }
    public String getId() { return id; }
    public String getLang() { return lang; }
}