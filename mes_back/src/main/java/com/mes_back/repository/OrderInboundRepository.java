package com.mes_back.repository;

import com.mes_back.entity.OrderInbound;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderInboundRepository extends JpaRepository<OrderInbound, Long> {
}
