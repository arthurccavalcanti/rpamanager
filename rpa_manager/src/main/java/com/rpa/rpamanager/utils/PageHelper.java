package com.rpa.rpamanager.utils;

import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

public class PageHelper {

    public static Pageable getPageable(String sortDir, Optional<String> sortBy, int page, int size) {

        String pageSortBy = "";
        if (!sortBy.isPresent() || !StringUtils.hasText(sortBy.get())) {
            pageSortBy = "id";
        } else {
            pageSortBy = sortBy.get();
        }
        if (!StringUtils.hasText(sortDir)) {
            sortDir = "asc";
        }
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 5;
        }
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc")
                                    ? Sort.Direction.DESC : Sort.Direction.ASC; 
        return PageRequest.of(page, size, Sort.by(direction, pageSortBy)); 
    }
}
