package com.mes_back.repository;

import com.mes_back.entity.MaterialInbound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface MaterialInboundRepository extends JpaRepository<MaterialInbound, Long> {

    @Query(value = "SELECT MAX(inbound_no) FROM material_inbound WHERE inbound_no LIKE :prefix%", nativeQuery = true)
    Optional<String> findMaxInboundNoNative(@Param("prefix") String prefix);

    List<MaterialInbound> findAllByDeletedAtIsNull();
}
