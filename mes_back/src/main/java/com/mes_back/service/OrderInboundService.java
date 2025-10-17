package com.mes_back.service;

import com.mes_back.dto.OrderInboundDTO.OrderInboundHistoryResponseDto;
import com.mes_back.dto.OrderInboundDTO.OrderInboundItemRequestDto;
import com.mes_back.entity.OrderInbound;

import com.mes_back.repository.OrderInboundRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class OrderInboundService {

    private final OrderInboundRepository orderInboundItemRequestRepository;
    private final OrderInboundRepository orderInboundRepository;

    public List<OrderInboundItemRequestDto> findAllByOrderInbound() {
        List<OrderInbound> orderInboundList = orderInboundItemRequestRepository.findAll();

        return orderInboundList.stream().map(oi -> {
            OrderInboundItemRequestDto dto = new OrderInboundItemRequestDto();
            dto.setOrderItemId(oi.getOrderItem().getOrderItemId());
            dto.setCustomerName(oi.getCustomer().getCompanyName());
            dto.setItemName(oi.getItemName());
            dto.setItemCode(oi.getItemCode());
            dto.setQty(oi.getQty());
            dto.setCategory(oi.getCategory());
            dto.setNote(oi.getNote());
            dto.setInboundDate(oi.getInboundDate());
            dto.setLotNo(oi.getLotNo());
            dto.setPaintType(oi.getPaintType());
            return dto;
        }).toList();
    }
    public List<OrderInboundHistoryResponseDto> findInboundForOutbound() {
        return orderInboundRepository.findAllByOrderByInboundDateDesc()
                .stream()
                .map(i -> new OrderInboundHistoryResponseDto(
                        i.getOrderInboundId(),
                        i.getOrderItem().getOrderItemId(),
                        i.getCustomer().getCompanyName(),  // Company 연동
                        i.getItemName(),
                        i.getItemCode(),
                        i.getQty(),
                        i.getCategory(),
                        i.getNote(),
                        i.getInboundDate(),
                        i.getLotNo(),
                        i.getPaintType()
                ))
                .collect(Collectors.toList());
    }



}

