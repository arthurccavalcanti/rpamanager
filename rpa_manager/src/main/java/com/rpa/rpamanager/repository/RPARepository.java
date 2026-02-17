package com.rpa.rpamanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.rpa.rpamanager.model.entity.RPA;
import java.util.List;

@Repository
public interface RPARepository extends JpaRepository<RPA, Long>,
                                       JpaSpecificationExecutor<RPA> {
    public List<RPA> findByUser_Id(Long userId);
    public List<RPA> findByUser_Username(String username);
    RPA findByNomeRPA(String nomeRPA);
    boolean existsByNomeRPA(String nomeRPA);
}






