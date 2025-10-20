package com.mes_back.repository;

import com.mes_back.dto.OrderInboundDto;
import com.mes_back.entity.OrderInbound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderInboundRepository extends JpaRepository<OrderInbound, Long> {
    @Query("""
    SELECT new com.mes_back.dto.OrderInboundDto(
        oi.orderInboundId,
        oi.lotNo,
        oi.company.companyName,
        oi.itemName,
        oi.itemCode,
        oi.inboundDate,
        oi.qty - COALESCE(
            (SELECT SUM(oo.qty) FROM OrderOutbound oo WHERE oo.orderInbound = oi), 
            0
        ),
        oi.category
    )
    FROM OrderInbound oi
""")
    List<OrderInboundDto> findInboundHistoriesForOutbound();

}
