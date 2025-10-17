package com.mes_back.repository;

import com.mes_back.entity.OrderItem;
import com.mes_back.entity.OrderItemRouting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRoutingRepository extends JpaRepository<OrderItemRouting, Long> {
    List<OrderItemRouting> findByOrderItem(OrderItem orderItem);
}
