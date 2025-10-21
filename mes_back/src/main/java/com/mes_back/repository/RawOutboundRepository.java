package com.mes_back.repository;

import com.mes_back.entity.MaterialOutbound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface RawOutboundRepository extends JpaRepository<MaterialOutbound, Long> {

    @Query("SELECT COUNT(o) FROM MaterialOutbound o WHERE o.outboundDate = :date")
    Long countByDate(@Param("date") LocalDate date);

}
