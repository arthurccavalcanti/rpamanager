package com.rpa.rpamanager.utils.specifications;

import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import com.rpa.rpamanager.model.entity.RPA;
import jakarta.persistence.criteria.Predicate;

public class RPASpecification {

    public static Specification<RPA> containsQuery(Optional<String> searchTerm) {
        return (root, query, criteriaBuilder) -> {
            if (searchTerm.isPresent()) {
                String valorSearchTerm = searchTerm.get();
                if (!StringUtils.hasText(valorSearchTerm)) {
                    return criteriaBuilder.conjunction(); // Retorna true se não há filtros
                }
                String likePattern = "%" + valorSearchTerm.toUpperCase() + "%";
                return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("nomeRPA")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("tipoRPA")), likePattern)
                );
            }
            return criteriaBuilder.conjunction();
        };
    }

    public static Specification<RPA> hasUserIdAndContainsQuery(Long userId, Optional<String> searchTerm) {
        return (root, query, criteriaBuilder) -> {
            Predicate hasUserId = criteriaBuilder.equal(root.get("user").get("id"), userId);
            if (searchTerm.isPresent()) {
                String valorSearchTerm = searchTerm.get();
                if (!StringUtils.hasText(valorSearchTerm)) {
                    return hasUserId;
                }
                String likePattern = "%" + valorSearchTerm.toUpperCase() + "%";
                Predicate matchesSearch = criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("nomeRPA")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.upper(root.get("tipoRPA")), likePattern)
                );
                return criteriaBuilder.and(matchesSearch, hasUserId);
            } else {
                return hasUserId;
            }
        };
    }
}

/*
 Root é entidade

 CriteraQuery (select), CriteriaBuilder (criador de critérios: equal, like, or, and, isNull)

 CriteriaBuilder.or(...)     SQL OR
 criteriaBuilder.like(expression,   pattern) SQL LIKE
 */