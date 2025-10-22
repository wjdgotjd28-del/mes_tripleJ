package com.mes_back.service;

import com.mes_back.dto.OrderOutboundDto;
import com.mes_back.entity.OrderInbound;
import com.mes_back.entity.OrderOutbound;
import com.mes_back.repository.OrderInboundRepository;
import com.mes_back.repository.OrderOutboundRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderOutboundService {

    private final OrderOutboundRepository orderOutboundRepository;
    private final OrderInboundRepository orderInboundRepository;

    private static final int MAX_RETRIES = 5;

    /**
     * 안전하게 출고 등록
     */
    public OrderOutboundDto addOrderOutbound(OrderOutboundDto dto) {
        int attempt = 0;

        while (true) {
            try {
                return saveOutbound(dto);
            } catch (DataIntegrityViolationException e) {
                // 🔹 unique 제약 위반만 재시도
                if (!e.getMostSpecificCause().getMessage().contains("outbound_no")) {
                    throw e;
                }

                attempt++;
                if (attempt >= MAX_RETRIES) {
                    throw new RuntimeException("출고번호 생성 충돌 발생. 잠시 후 다시 시도해주세요.");
                }

                // 🔹 랜덤 백오프 적용: 50~150ms
                try {
                    Thread.sleep(50 + ThreadLocalRandom.current().nextInt(100));
                } catch (InterruptedException ignored) {}
            }
        }
    }

    @Transactional
    protected OrderOutboundDto saveOutbound(OrderOutboundDto dto) {
        OrderInbound orderInbound = orderInboundRepository.findById(dto.getOrderInboundId())
                .orElseThrow(() -> new IllegalArgumentException("해당 입고 정보를 찾을 수 없습니다. id=" + dto.getOrderInboundId()));

        // 🔹 현재까지 출고된 수량 조회
        Long currentTotalOutboundQty = orderOutboundRepository.sumOutboundQtyByOrderInbound(orderInbound)
                .orElse(0L); // 출고된 수량이 없으면 0으로 간주

        // 🔹 잔여 수량 계산
        Long availableQty = orderInbound.getQty() - currentTotalOutboundQty;

        // 🔹 출고 가능 여부 검증
        if (dto.getQty() <= 0) {
            throw new IllegalArgumentException("출고 수량은 0보다 커야 합니다.");
        }
        if (dto.getQty() > availableQty) {
            throw new IllegalArgumentException("출고 수량이 입고 잔여 수량(" + availableQty + ")을 초과할 수 없습니다.");
        }

        // 🔹 트랜잭션 안에서 안전하게 출고번호 생성
        String outboundNo = generateOutboundNo();

        OrderOutbound orderOutbound = OrderOutbound.builder()
                .orderInbound(orderInbound)
                .customerName(dto.getCustomerName())
                .itemName(dto.getItemName())
                .itemCode(dto.getItemCode())
                .qty(dto.getQty())
                .category(dto.getCategory())
                .outboundNo(outboundNo)
                .outboundDate(LocalDate.now())
                .build();

        OrderOutbound saved = orderOutboundRepository.save(orderOutbound);

        return OrderOutboundDto.builder()
                .id(saved.getId())
                .orderInboundId(orderInbound.getOrderInboundId())
                .customerName(saved.getCustomerName())
                .itemName(saved.getItemName())
                .itemCode(saved.getItemCode())
                .qty(saved.getQty())
                .category(saved.getCategory())
                .outboundNo(saved.getOutboundNo())
                .outboundDate(saved.getOutboundDate())
                .inboundDate(orderInbound.getInboundDate())
                .color(saved.getOrderInbound().getOrderItem().getColor())
                .build();
    }

    protected String generateOutboundNo() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "OUT-" + today + "-";

        Optional<String> lastNoOptional = orderOutboundRepository.findMaxOutboundNoNative(prefix);
        int nextSeq = 1;
        if (lastNoOptional.isPresent()) {
            String lastNo = lastNoOptional.get();
            String lastSeq = lastNo.substring(lastNo.lastIndexOf("-") + 1);
            nextSeq = Integer.parseInt(lastSeq) + 1;
        }

        // 🔹 번호 자리수
        if (nextSeq > 999) throw new IllegalStateException("출고번호가 999를 초과했습니다.");

        return prefix + String.format("%03d", nextSeq);
    }

    @Transactional(readOnly = true)
    public List<OrderOutboundDto> findAll() {
        return orderOutboundRepository.findAll().stream()
                .map(o -> OrderOutboundDto.builder()
                        .id(o.getId())
                        .orderInboundId(o.getOrderInbound().getOrderInboundId())
                        .customerName(o.getCustomerName())
                        .itemName(o.getItemName())
                        .itemCode(o.getItemCode())
                        .qty(o.getQty())
                        .category(o.getCategory())
                        .outboundNo(o.getOutboundNo())
                        .outboundDate(o.getOutboundDate())
                        .inboundDate(o.getOrderInbound().getInboundDate())
                        .color(o.getOrderInbound().getOrderItem().getColor())
                        .build())
                .collect(Collectors.toList());
    }


    @Transactional
    public OrderOutboundDto updateOrderOutbound(OrderOutboundDto orderOutboundDto) {
        OrderOutbound orderOutbound = orderOutboundRepository.findById(orderOutboundDto.getId())
                .orElseThrow(() -> new EntityNotFoundException("OrderOutbound not found with id: " + orderOutboundDto.getId()));
        orderOutbound.updateOrderOutbound(orderOutboundDto);
        return orderOutboundDto;

    }

    @Transactional
    public Long deleteOrderOutbound(Long id) {
        orderOutboundRepository.deleteById(id);
        return id;
    }
}
