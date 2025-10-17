package com.mes_back.service;

import com.mes_back.dto.OrderOutboundDto;
import com.mes_back.entity.OrderInbound;
import com.mes_back.entity.OrderOutbound;
import com.mes_back.repository.OrderInboundRepository;
import com.mes_back.repository.OrderOutboundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderOutboundService {

    private final OrderOutboundRepository orderOutboundRepository;
    private final OrderInboundRepository orderInboundRepository;

    public OrderOutboundDto addOrderOutbound(OrderOutboundDto orderOutboundDto) {
        // DTO의 ID로 실제 OrderInbound 엔티티를 DB에서 조회
        OrderInbound orderInbound = orderInboundRepository.findById(orderOutboundDto.getOrderInboundId())
                .orElseThrow(() -> new IllegalArgumentException("해당 입고 정보를 찾을 수 없습니다. id=" + orderOutboundDto.getOrderInboundId()));

        OrderOutbound orderOutbound = OrderOutbound.builder()
                .orderInbound(orderInbound) // ✅ (수정) 조회한 엔티티를 사용
                .customerName(orderOutboundDto.getCustomerName())
                .itemName(orderOutboundDto.getItemName())
                .itemCode(orderOutboundDto.getItemCode())
                .qty(orderOutboundDto.getQty())
                .category(orderOutboundDto.getCategory())
                .outboundNo(orderOutboundDto.getOutboundNo())
                .outboundDate(orderOutboundDto.getOutboundDate())
                .build();

        OrderOutbound savedOrderOutbound = orderOutboundRepository.save(orderOutbound);
        orderOutboundDto.setId(savedOrderOutbound.getId());
        return orderOutboundDto;
    }
}