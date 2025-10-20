package com.mes_back.repository;

import com.mes_back.entity.OrderItem;
import com.mes_back.entity.OrderItemRouting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRoutingRepository extends JpaRepository<OrderItemRouting, Long> {
    List<OrderItemRouting> findByOrderItem(OrderItem orderItem);

    // ⭐ OrderInbound ID로 OrderItemRouting 조회 (JPQL 사용)
    @Query("SELECT oir FROM OrderItemRouting oir " +
            "WHERE oir.orderItem.orderItemId IN " +
            "(SELECT oib.orderItem.orderItemId FROM OrderInbound oib WHERE oib.orderInboundId = :orderInboundId)")
    List<OrderItemRouting> findByOrderInboundId(@Param("orderInboundId") Long orderInboundId);

    // ⭐ 더 정확한 쿼리: OrderInbound ID로 모든 OrderItemRouting 조회
    @Query("SELECT oir FROM OrderItemRouting oir " +
            "JOIN OrderInbound oib ON oib.orderItem = oir.orderItem " +
            "WHERE oib.orderInboundId = :orderInboundId")
    List<OrderItemRouting> findAllByOrderInboundId(@Param("orderInboundId") Long orderInboundId);
}
