package com.rpa.rpamanager.utils;

import java.util.List;
import java.util.Map;

public class MensagemCelery {

    private final List<Object> args;
    private final Map<String, Object> kwargs;
    private final Map<String, Object> embed;

    public MensagemCelery(List<Object> args, Map<String, Object> kwargs, Map<String, Object> embed) {
        this.args = args;
        this.kwargs = kwargs;
        this.embed = embed;
    }

    public List<Object> getArgs() { return args; }
    public Map<String, Object> getKwargs() { return kwargs; }
    public Map<String, Object> getEmbed() { return embed; }
}