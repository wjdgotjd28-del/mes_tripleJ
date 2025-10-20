package com.mes_back.service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.mes_back.dto.OrderInboundDTO;
import com.mes_back.entity.OrderInbound;
import com.mes_back.entity.OrderItem;
import com.mes_back.repository.OrderInboundRepository;
import com.mes_back.repository.OrderItemRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class OrderInboundService {

    private final OrderInboundRepository orderInboundRepository;
    private final OrderItemRepository orderItemRepository;

    public void softDeleteById(Long id) {
        OrderInbound entity = orderInboundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 입고 기록입니다."));
        entity.setDeletedAt(LocalDateTime.now());
        orderInboundRepository.save(entity); // ✅ 상태 변경 저장
    }


    public List<OrderInboundDTO> findInboundHistoriesForOutbound() {
        return orderInboundRepository.findInboundHistoriesForOutbound();
    }

    public List<OrderInboundDTO> findAllByOrderInbound() {
        List<OrderInbound> orderInboundList = orderInboundRepository.findByDeletedAtIsNull(); // ✅ 삭제되지 않은 데이터만 조회

        return orderInboundList.stream()
                .map(oi -> OrderInboundDTO.builder()
                        .orderInboundId(oi.getOrderInboundId())
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

    public void updateInbound(Long id, OrderInboundDTO orderInboundDTO) {
        OrderInbound entity = orderInboundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 입고 기록입니다."));

        entity.setQty(orderInboundDTO.getQty());
        entity.setInboundDate(orderInboundDTO.getInboundDate());

        orderInboundRepository.save(entity);

    }




    public void save(OrderInboundDTO dto) {
        OrderItem orderItem = orderItemRepository.findById(dto.getOrderItemId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 수주 품목입니다."));

        OrderInbound entity = OrderInbound.builder()
                .orderItem(orderItem)
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
        String today = new SimpleDateFormat("yyyyMMdd").format(new Date());

        String lastLotNo = orderInboundRepository.findLastLotNoByInboundDate(today); // ✅ 문자열로 전달

        int nextSequence = 1;
        if (lastLotNo != null && lastLotNo.matches("LOT-" + today + "-\\d{3}")) {
            String[] parts = lastLotNo.split("-");
            nextSequence = Integer.parseInt(parts[2]) + 1;
        }

        return String.format("LOT-%s-%03d", today, nextSequence);
    }
}