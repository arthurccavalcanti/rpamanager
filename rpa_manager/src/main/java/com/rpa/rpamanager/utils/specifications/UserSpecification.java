package com.rpa.rpamanager.utils.specifications;

import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import com.rpa.rpamanager.model.entity.User;

public class UserSpecification {

    public static Specification<User> nameContains(Optional<String> searchTerm) {
        return (root, query, criteriaBuilder) -> {
            if (searchTerm.isPresent()) {
                String valorSearchTerm = searchTerm.get();
                if (!StringUtils.hasText(valorSearchTerm)) {
                    return criteriaBuilder.conjunction();
                }
                String likePattern = "%" + valorSearchTerm.toUpperCase() + "%";
                return criteriaBuilder.like(criteriaBuilder.upper(root.get("username")), likePattern);
            }
            return criteriaBuilder.conjunction();
        };
    }
}