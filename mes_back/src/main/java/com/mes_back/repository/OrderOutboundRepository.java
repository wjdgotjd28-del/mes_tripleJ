package com.mes_back.repository;

import com.mes_back.entity.OrderInbound;
import com.mes_back.entity.OrderOutbound;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderOutboundRepository extends JpaRepository<OrderOutbound, Long> {
    // 오늘 날짜 (prefix)에 해당하는 출고번호 중 가장 큰 번호 조회 (네이티브 쿼리 사용)
    @Query(value = "SELECT oo.outbound_no FROM order_outbound oo WHERE oo.outbound_no LIKE CONCAT(:prefix, '%') ORDER BY oo.outbound_no DESC LIMIT 1", nativeQuery = true)
    Optional<String> findMaxOutboundNoNative(@Param("prefix") String prefix);

    // 특정 OrderInbound에 대한 총 출고 수량 합산
    @Query("SELECT SUM(oo.qty) FROM OrderOutbound oo WHERE oo.orderInbound = :orderInbound")
    Optional<Long> sumOutboundQtyByOrderInbound(@Param("orderInbound") OrderInbound orderInbound);

}