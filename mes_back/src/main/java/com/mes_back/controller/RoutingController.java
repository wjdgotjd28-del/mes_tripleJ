package com.mes_back.controller;

import com.mes_back.dto.RoutingDTO;
import com.mes_back.entity.Routing;
import com.mes_back.service.RoutingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/routing")
@RequiredArgsConstructor
@Slf4j

public class RoutingController {

    // RoutingService를 주입받아 비즈니스 로직을 처리
    private final RoutingService routingService;


    /**
     * 모든 공정 정보를 조회합니다.
     * GET /routing 요청 시 실행됩니다.
     *
     * @return 전체 Routing 리스트를 담은 ResponseEntity
     */
    @GetMapping
    public ResponseEntity<List<RoutingDTO>> getAllRoutings() {
        List<RoutingDTO> routings = routingService.findAll();
        return ResponseEntity.ok(routings);
    }

    /**
     * 새로운 공정 정보를 등록합니다.
     * POST /routing 요청 시 실행되며, 요청 본문에 DTO를 받아 저장합니다.
     *
     * @param dto 클라이언트가 전달한 공정 정보 DTO
     * @return 저장된 Routing 엔티티를 담은 ResponseEntity
     */
    @PostMapping
    public ResponseEntity<Routing> registerRouting(@RequestBody RoutingDTO dto) {
        Routing saved = routingService.save(dto);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRouting(@PathVariable Long id) {
        routingService.DeleteById(id);
        return ResponseEntity.noContent().build();
    }

}