package com.mes_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mes_back.dto.OrderItemDTO;
import com.mes_back.dto.OrderItemRequestDTO;
import com.mes_back.dto.OrderItemRoutingDTO;
import com.mes_back.service.MasterDataOrderItemsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
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
//    @PostMapping("/order/new")
//    public ResponseEntity<OrderItemDTO> createOrderItem(
//            @RequestPart("orderItem") OrderItemRequestDTO requestDTO,
//            @RequestPart(value="routing", required=false) List<OrderItemRoutingDTO> routingList,
//            @RequestPart(value="images", required=false) List<MultipartFile> images
//    ) throws IOException {
//        OrderItemDTO savedItem = masterDataOrderItemsService.createOrderItemWithFiles(requestDTO, routingList, images);
//        return ResponseEntity.ok(savedItem);
//    }
    @PostMapping("/order/new")
    public ResponseEntity<OrderItemDTO> createOrderItem(
            @RequestPart("orderItem") String orderItemJson,
            @RequestPart(value="routing", required=false) String routingJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        OrderItemRequestDTO requestDTO = mapper.readValue(orderItemJson, OrderItemRequestDTO.class);

        if (routingJson != null) {
            List<OrderItemRoutingDTO> routingList =
                    Arrays.asList(mapper.readValue(routingJson, OrderItemRoutingDTO[].class));
            requestDTO.setRouting(routingList);
        }

        OrderItemDTO savedItem = masterDataOrderItemsService.createOrderItemWithFiles(
                requestDTO,
                requestDTO.getRouting(),
                images
        );

        return ResponseEntity.ok(savedItem);
    }
    
    // 수주 대상 품목 수정
    @PutMapping("/order/{id}")
    public ResponseEntity<OrderItemDTO> updateOrderItem(
            @PathVariable Long id,
            @RequestPart("orderItem") OrderItemRequestDTO requestDTO,
            @RequestPart(value = "routing", required = false) List<OrderItemRoutingDTO> routingList,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        OrderItemDTO updatedItem = masterDataOrderItemsService.updateOrderItemWithFiles(id, requestDTO, routingList, images);
        return ResponseEntity.ok(updatedItem);
    }

    // 수주 대상 품목 이미지 삭제
    @DeleteMapping("/order/image/{id}")
    public ResponseEntity<String> deleteOrderItemImage(@PathVariable Long id) {
        masterDataOrderItemsService.deleteSingleImage(id);
        return ResponseEntity.ok("삭제 완료");
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
