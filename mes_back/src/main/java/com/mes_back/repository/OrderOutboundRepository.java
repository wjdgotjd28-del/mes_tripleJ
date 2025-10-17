package com.mes_back.repository;

import com.mes_back.entity.OrderOutbound;
import org.springframework.data.jpa.repository.JpaRepository;

// ✅ (수정) JpaRepository<OrderOutbound, Integer> -> JpaRepository<OrderOutbound, Long>
public interface OrderOutboundRepository extends JpaRepository<OrderOutbound, Long> {
}