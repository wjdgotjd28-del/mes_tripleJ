package com.mes_back.repository;

import com.mes_back.dto.OrderInboundDTO;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.mes_back.entity.QOrderInbound.orderInbound;
import static com.mes_back.entity.QOrderOutbound.orderOutbound;
import static com.mes_back.entity.QProcessTracking.processTracking;

@RequiredArgsConstructor
public class OrderInboundRepositoryCustomImpl implements OrderInboundRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<OrderInboundDTO> findInboundHistoriesForOutbound() {
        return queryFactory
                .select(Projections.constructor(OrderInboundDTO.class,
                        orderInbound.orderInboundId,
                        orderInbound.lotNo,
                        orderInbound.company.companyName,
                        orderInbound.itemName,
                        orderInbound.itemCode,
                        orderInbound.inboundDate,
                        orderInbound.qty.subtract(
                                JPAExpressions.select(orderOutbound.qty.sum().coalesce(0L))
                                        .from(orderOutbound)
                                        .where(orderOutbound.orderInbound.eq(orderInbound))
                        ),
                        orderInbound.category,
                        processTracking.processStatus
                ))
                .from(orderInbound)
                .leftJoin(processTracking)
                .on(processTracking.orderInbound.eq(orderInbound))
                // ✅ 추가: processStatus == 2 조건
                .where(processTracking.processStatus.eq(2))
                .fetch();
    }

    @Override
    public String findLastLotNoByInboundDate(String datePrefix) {
        return queryFactory
                .select(orderInbound.lotNo)
                .from(orderInbound)
                .where(orderInbound.lotNo.like("LOT-" + datePrefix + "%"))
                .orderBy(orderInbound.lotNo.desc())
                .limit(1)
                .fetchOne();
    }
}
