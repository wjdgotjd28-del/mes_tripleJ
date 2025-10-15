package com.mes_back.controller;

import com.mes_back.dto.OrderItemDTO;
import com.mes_back.dto.OrderItemRequestDTO;
import com.mes_back.service.MasterDataOrderItemsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@Slf4j
public class MasterDataOrderItemsController {

    private final MasterDataOrderItemsService masterDataOrderItemsService;

    // 수주 대상 품목 조회
    @GetMapping("/order")
    public List<OrderItemRequestDTO> getOrderItems() {
        return masterDataOrderItemsService.getOrderItem();
    }

    // 수주 대상 품목 상세 조회
    @GetMapping("/order/dtl/{id}")
    public ResponseEntity<OrderItemRequestDTO> getOrderItemById(@PathVariable Long id) {
        OrderItemRequestDTO dto = masterDataOrderItemsService.getOrderItemById(id);
        return ResponseEntity.ok(dto);
    }

    // 수주 대상 품목 등록
    @PostMapping("/order/new")
    public ResponseEntity<OrderItemDTO> createOrderItem(@RequestBody OrderItemRequestDTO materialItemRequestDTO) {
        OrderItemDTO savedItem = masterDataOrderItemsService.createOrderItem(materialItemRequestDTO);
        return ResponseEntity.ok(savedItem);
    }

    // 수주 대상 품목 수정
    @PutMapping("/order/{id}")
    public ResponseEntity<OrderItemDTO> updateOrderItem(
            @PathVariable Long id, @RequestBody OrderItemRequestDTO requestDTO) {
        OrderItemDTO updatedItem = masterDataOrderItemsService.updateOrderItem(id, requestDTO);
        return ResponseEntity.ok(updatedItem);
    }

    // 수주 대상 품목 삭제
    @DeleteMapping("/order/delete/{id}")
    public ResponseEntity<String> deleteOrderItem(@PathVariable Long id) {
        masterDataOrderItemsService.deleteOrderItem(id);
        return ResponseEntity.ok("삭제 완료");
    }

    // 수주 대상 품목 사용여부 복원
    @PostMapping("/order/{id}")
    public ResponseEntity<OrderItemDTO> toggleUseYn(@PathVariable Long id) {
        OrderItemDTO updated = masterDataOrderItemsService.restoreOrderItem(id);
        return ResponseEntity.ok(updated);
    }
}
