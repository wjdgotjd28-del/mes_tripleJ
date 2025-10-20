package com.mes_back.controller;

import com.mes_back.dto.CompanyDto;
import com.mes_back.dto.ProcessTrackingDTO;
import com.mes_back.service.OrderInboundProcessTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders/inbound")
public class OrderInboundProcessTrackingController {

    private final OrderInboundProcessTrackingService orderInboundProcessTrackingService;

    // 공정 진행 현황 조회
    @GetMapping("/process/{id}")
    public List<ProcessTrackingDTO> getProcessTracking(@PathVariable Long id) {
        return orderInboundProcessTrackingService.getProcessTracking(id);
    }

    // 공정 진행 현황 등록 (초기화) ⭐ 추가
    @PostMapping("/process")
    public ProcessTrackingDTO createProcessTracking(@RequestBody ProcessTrackingDTO dto) {
        return orderInboundProcessTrackingService.createProcessTracking(dto);
    }

    // 공정 진행 현황 업데이트
    @PutMapping("/process")
    public ProcessTrackingDTO updateProcessTracking(@RequestBody ProcessTrackingDTO dto) {
        return orderInboundProcessTrackingService.updateProcessTracking(dto);
    }
}
