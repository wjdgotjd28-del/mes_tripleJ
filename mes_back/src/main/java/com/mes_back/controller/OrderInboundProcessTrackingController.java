package com.mes_back.controller;

import com.mes_back.dto.ProcessTrackingDTO;
import com.mes_back.service.OrderInboundProcessTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders/inbound")
public class OrderInboundProcessTrackingController {

    private final OrderInboundProcessTrackingService orderInboundProcessTrackingService;

    // 공정 진행 현황 조회
    @GetMapping("/process/{id}")
    public ResponseEntity<List<ProcessTrackingDTO>> getProcessTracking(@PathVariable Long id) {
        List<ProcessTrackingDTO> result = orderInboundProcessTrackingService.getProcessTracking(id);
        return ResponseEntity.ok(result);
    }

    // ⭐ 공정 진행 현황 등록 (초기화) - 배열 형태로 받아서 처리
    @PostMapping("/process")
    public ResponseEntity<List<ProcessTrackingDTO>> createProcessTracking(@RequestBody List<ProcessTrackingDTO> dtos) {
        // 배열로 받은 DTO 리스트를 Service의 createProcessTrackingBatchList로 전달
        List<ProcessTrackingDTO> result = orderInboundProcessTrackingService.createProcessTrackingBatchList(dtos);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    // 공정 진행현황 일괄 업데이트 (배열 처리용)
    @PutMapping("/process/batch")
    public ResponseEntity<List<ProcessTrackingDTO>> updateProcessTrackingBatch(
            @RequestBody List<ProcessTrackingDTO> dtoList) {
        List<ProcessTrackingDTO> result = orderInboundProcessTrackingService.updateProcessTrackingBatch(dtoList);
        return ResponseEntity.ok(result);
    }
}