package com.rpa.rpamanager.utils.specifications;

import jakarta.persistence.criteria.Predicate;
import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.rpa.rpamanager.model.entity.Processo;


public class ProcessoSpecification {

    public static Specification<Processo> containsQuery(Optional<String> searchTerm) {
        return (root, query, criteriaBuilder) -> {
            if (searchTerm.isPresent()) {
                String valorSearchTerm = searchTerm.get();
                if (!StringUtils.hasText(valorSearchTerm)) {
                    return criteriaBuilder.conjunction();
                }
                String likePattern = "%" + valorSearchTerm.toUpperCase() + "%";
                return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("status")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("detalhes")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("resultado")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("mensagemErro")), likePattern)
                );
            }
            return criteriaBuilder.conjunction();
        };
    }

    public static Specification<Processo> hasUserIdAndContainsQuery(Long userId, Optional<String> searchTerm) {
        return (root, query, criteriaBuilder) -> {
            Predicate hasUserId = criteriaBuilder.equal(root.get("rpa").get("user").get("id"), userId);
            if (searchTerm.isPresent()) {
                String valorSearchTerm = searchTerm.get();
                if (!StringUtils.hasText(valorSearchTerm)) {
                    return hasUserId;
                }
                String likePattern = "%" + valorSearchTerm.toUpperCase() + "%";
                Predicate matchesSearch = criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("status")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("detalhes")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("resultado")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("mensagemErro")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("url")), likePattern)
                );
                return criteriaBuilder.and(matchesSearch, hasUserId);
            } else {
                return hasUserId;
            }
        };
    }
}
