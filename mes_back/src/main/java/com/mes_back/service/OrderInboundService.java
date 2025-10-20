package com.mes_back.service;

//import com.mes_back.dto.OrderInboundDTO.OrderInboundItemRequestDto;
import com.mes_back.dto.OrderInboundDto;
import com.mes_back.entity.OrderInbound;

import com.mes_back.repository.OrderInboundRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class OrderInboundService {

    private final OrderInboundRepository orderInboundItemRequestRepository;

    public List<OrderInboundDto> findInboundHistoriesForOutbound() {
        return orderInboundItemRequestRepository.findAll().stream()
                .map(orderInbound -> OrderInboundDto.builder()
                        .orderInboundId(orderInbound.getOrderInboundId())
                        .lotNo(orderInbound.getLotNo())
                        .customerName(orderInbound.getCompany() != null ? orderInbound.getCompany().getCompanyName() : null)
                        .itemName(orderInbound.getItemName())
                        .itemCode(orderInbound.getItemCode())
                        .inboundDate(orderInbound.getInboundDate())
                        .qty(orderInbound.getQty())
                        .category(orderInbound.getCategory())
                        .build())
                .toList();
    }

//    public List<OrderInboundItemRequestDto> findAllByOrderInbound() {
//        List<OrderInbound> orderInboundList = orderInboundItemRequestRepository.findAll();
//
//        return orderInboundList.stream().map(oi -> {
//            OrderInboundItemRequestDto dto = new OrderInboundItemRequestDto();
//            dto.setOrderItemId(oi.getOrderItem().getOrderItemId());
//            dto.setCustomerName(oi.getCustomerName());
//            dto.setItemName(oi.getItemName());
//            dto.setItemCode(oi.getItemCode());
//            dto.setQty(oi.getQty());
//            dto.setCategory(oi.getCategory());
//            dto.setNote(oi.getNote());
//            dto.setInboundDate(oi.getInboundDate());
//            dto.setLotNo(oi.getLotNo());
//            dto.setPaintType(oi.getPaintType());
//            return dto;
//        }).toList();
//    }



}

