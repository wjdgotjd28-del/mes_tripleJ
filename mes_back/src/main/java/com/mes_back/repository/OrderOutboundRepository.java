package com.mes_back.repository;

import com.mes_back.entity.OrderOutbound;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderOutboundRepository extends JpaRepository<OrderOutbound, Long> {
    // 오늘 날짜 (prefix)에 해당하는 출고번호 중 가장 큰 번호 조회
    @Query("SELECT o.outboundNo FROM OrderOutbound o WHERE o.outboundNo LIKE CONCAT(:prefix, '%') ORDER BY  o.outboundNo DESC")
    String findMaxOutboundNo(@Param("prefix")String prefix);

}