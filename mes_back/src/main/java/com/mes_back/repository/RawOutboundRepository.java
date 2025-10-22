package com.mes_back.repository;

import com.mes_back.entity.MaterialOutbound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface RawOutboundRepository extends JpaRepository<MaterialOutbound, Long> {

    @Query("SELECT COUNT(m) FROM MaterialOutbound m " +
            "WHERE m.outboundDate >= :start AND m.outboundDate < :end")
    Long countByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(m) FROM MaterialOutbound m " +
            "WHERE m.outboundDate = :date")
    Long countByDate(@Param("date") LocalDate date);

}
