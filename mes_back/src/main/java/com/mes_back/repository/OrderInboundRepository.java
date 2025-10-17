package com.mes_back.repository;

import com.mes_back.dto.OrderInboundDTO.OrderInboundHistoryResponseDto;
import com.mes_back.entity.OrderInbound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderInboundRepository extends JpaRepository<OrderInbound, Long> {
    List<OrderInbound> findAllByOrderByInboundDateDesc();
}
