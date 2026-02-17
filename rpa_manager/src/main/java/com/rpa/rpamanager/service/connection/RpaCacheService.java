package com.rpa.rpamanager.service.connection;

import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
public class RpaCacheService {

    private static final String RPA_LIST_CACHE = "rpaListCache";
    private static final String RPA_LIST_KEY = "'rpaList'";

    @CachePut(value = RPA_LIST_CACHE, key = RPA_LIST_KEY)
    public List<String> updateRpaList(List<String> rpaList) {
        System.out.println("Atualizando cache: " + rpaList);
        // Formatação para transformar ["[example", "example2]"] em ["example", "example2"]
        List<String> formattedCache = new ArrayList<>();
        Pattern pattern = Pattern.compile("\"([^\"]*)\"");
        rpaList.forEach(item -> {
            Matcher matcher = pattern.matcher(item);
            while (matcher.find()) {
                formattedCache.add(matcher.group(1));
            }
        });
        return formattedCache;
    }

    // Se cache está vazio, retorna lista vazia
    @Cacheable(value = RPA_LIST_CACHE, key = RPA_LIST_KEY)
    public List<String> getRpaList() {
        System.out.println("Cache vazio.");
        return Collections.emptyList();
    }
}
