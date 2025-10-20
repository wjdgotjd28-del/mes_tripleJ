package com.mes_back.controller;


import com.mes_back.dto.OrderInboundDto;
import com.mes_back.service.OrderInboundService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders/inbound")
@Slf4j
public class OrderInboundIController {

    private final OrderInboundService orderInboundService;
]
//    @GetMapping("/items")
//    public ResponseEntity<List<OrderInboundItemRequestDto> findAllItems() {
//        List<OrderInboundItemRequestDto> OrderInboundItemRequestDtos = orderInboundService.findAllByOrderInbound();
//        return ResponseEntity.ok(OrderInboundItemRequestDtos);
//    }

//    @GetMapping("/items")
//    public ResponseEntity<List<OrderInboundItemRequestDto> findAllItems() {
//        List<OrderInboundItemRequestDto> OrderInboundItemRequestDtos = orderInboundService.findAllByOrderInbound();
//        return ResponseEntity.ok(OrderInboundItemRequestDtos);
//    }

    @GetMapping("/orderoutbound")
    public List<OrderInboundDTO> findInboundHistoriesForOutbound() {
        return orderInboundService.findInboundHistoriesForOutbound();
    }

//    @GetMapping("/items")
//    public ResponseEntity<List<OrderInboundItemRequestDto> findAllItems() {
//        List<OrderInboundItemRequestDto> OrderInboundItemRequestDtos = orderInboundService.findAllByOrderInbound();
//        return ResponseEntity.ok(OrderInboundItemRequestDtos);
//    }

    @GetMapping("/orderoutbound")
    public List<OrderInboundDto> findInboundHistoriesForOutbound() {
        return orderInboundService.findInboundHistoriesForOutbound();
    }
}
