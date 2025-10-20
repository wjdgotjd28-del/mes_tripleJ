package com.mes_back.repository;

import com.mes_back.entity.OrderInbound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OrderInboundRepository extends JpaRepository<OrderInbound, Long>, OrderInboundRepositoryCustom {

    List<OrderInbound> findByDeletedAtIsNull();

}
