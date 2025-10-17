package com.mes_back.service;

import com.mes_back.dto.OrderInboundDTO;
import com.mes_back.entity.OrderInbound;
import com.mes_back.entity.OrderItem;
import com.mes_back.repository.OrderInboundRepository;
import com.mes_back.repository.OrderItemRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class OrderInboundService {

    private final OrderInboundRepository orderInboundRepository;

    private final OrderItemRepository orderItemRepository;


    public List<OrderInboundDTO> findAllByOrderInbound() {
        List<OrderInbound> orderInboundList = orderInboundRepository.findAll();

        return orderInboundList.stream()
                .map(oi -> OrderInboundDTO.builder()
                        .orderItemId(oi.getOrderItem().getOrderItemId())
                        .customerName(oi.getCustomerName())
                        .itemName(oi.getItemName())
                        .itemCode(oi.getItemCode())
                        .qty(oi.getQty())
                        .category(oi.getCategory())
                        .note(oi.getNote())
                        .inboundDate(oi.getInboundDate())
                        .lotNo(oi.getLotNo())
                        .paintType(oi.getPaintType())
                        .build()
                ).toList();
    }

    public void save(OrderInboundDTO dto) {
        OrderItem orderItem = orderItemRepository.findById(dto.getOrderItemId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 수주 품목입니다."));

        OrderInbound entity = OrderInbound.builder()
                .orderItem(orderItem) // ✅ 객체로 넘김
                .category(dto.getCategory())
                .customerName(dto.getCustomerName())
                .inboundDate(dto.getInboundDate())
                .itemCode(dto.getItemCode())
                .itemName(dto.getItemName())
                .lotNo(generateLotNo())
                .note(dto.getNote())
                .paintType(dto.getPaintType())
                .qty(dto.getQty())
                .build();

        orderInboundRepository.save(entity);
    }


    private String generateLotNo() {
        return "LOT-" + System.currentTimeMillis(); // 예시 로직
    }
}