package com.mes_back.repository;

import com.mes_back.dto.OrderInboundDTO;
import com.mes_back.entity.QProcessTracking;
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
        // 각 수주(inbound)에서 가장 최근에 시작된 공정이 완료(status=2)되었는지 확인하는 로직
        QProcessTracking ptSub = new QProcessTracking("ptSub");

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
                .join(processTracking).on(processTracking.orderInbound.eq(orderInbound))
                .where(
                        // 1. 현재 공정이 가장 최근에 시작된 공정인지 확인
                        processTracking.processStartTime.eq(
                                JPAExpressions.select(ptSub.processStartTime.max())
                                        .from(ptSub)
                                        .where(ptSub.orderInbound.eq(orderInbound))
                        ),
                        // 2. 그리고 그 공정의 상태가 '완료'인지 확인
                        processTracking.processStatus.eq(2)
                )
                .groupBy(orderInbound.orderInboundId, orderInbound.lotNo, orderInbound.company.companyName, orderInbound.itemName, orderInbound.itemCode, orderInbound.inboundDate, orderInbound.qty, orderInbound.category, processTracking.processStatus) // 중복 방지
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
