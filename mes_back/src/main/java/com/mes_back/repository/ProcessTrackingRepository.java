package com.mes_back.repository;

import com.mes_back.entity.OrderItem;
import com.mes_back.entity.ProcessTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProcessTrackingRepository extends JpaRepository<ProcessTracking, Long> {

    @Query("SELECT pt FROM ProcessTracking pt " +
            "JOIN FETCH pt.orderItemRouting r " +
            "JOIN FETCH r.orderItem oi " +
            "LEFT JOIN FETCH r.routing " +
            "WHERE pt.orderInbound.orderInboundId = :id")
    List<ProcessTracking> findProcessTrackingWithOrderItem(@Param("id") Long id);

}
