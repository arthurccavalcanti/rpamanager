
package com.rpa.rpamanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import com.rpa.rpamanager.model.entity.Processo;

@Repository
public interface ProcessoRepository extends JpaRepository<Processo, Long>,
                                            JpaSpecificationExecutor<Processo> {
    boolean existsById(@NonNull Long id_processo);
}