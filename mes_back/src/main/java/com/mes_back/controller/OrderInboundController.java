package com.mes_back.controller;


import com.mes_back.dto.OrderInboundDTO;
import com.mes_back.service.OrderInboundService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders/inbound")
@Slf4j
public class OrderInboundController {

    private final OrderInboundService orderInboundService;
    @GetMapping("/orderoutbound")
    public List<OrderInboundDTO> findInboundHistoriesForOutbound() {
        return orderInboundService.findInboundHistoriesForOutbound();
    }

    @GetMapping("/items")
    public ResponseEntity<List<OrderInboundDTO>> findAllItems() {
        List<OrderInboundDTO> orderInboundDTOS = orderInboundService.findAllByOrderInbound();
        return ResponseEntity.ok(orderInboundDTOS);
    }

    @PostMapping("/items")
    public ResponseEntity<Void> registerInbound(@RequestBody OrderInboundDTO dto) {
        orderInboundService.save(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<OrderInboundDTO>> findAllHistory() {
        List<OrderInboundDTO> orderInboundDTOS = orderInboundService.findAllByOrderInbound(); // ✅ 수정된 메서드 호출
        return ResponseEntity.ok(orderInboundDTOS);
    }


    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        orderInboundService.softDeleteById(id); // ✅ 수정된 메서드 호출
        return ResponseEntity.ok().build();
    }

    @PutMapping("/history/{id}")
    public ResponseEntity<Void> updateHistory(@PathVariable Long id, @RequestBody OrderInboundDTO dto) {
        orderInboundService.updateInbound(id, dto);
        return ResponseEntity.ok().build();
    }

}
