package com.mes_back.repository;

import com.mes_back.entity.MaterialInbound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface RawInboundRepository extends JpaRepository<MaterialInbound, Long> {



}
