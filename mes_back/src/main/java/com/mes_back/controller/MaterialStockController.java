// 컨트롤러 클래스가 속한 패키지
package com.mes_back.controller;

import com.mes_back.dto.MaterialStockDTO;
import com.mes_back.service.MaterialStockService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * - 클라이언트로부터의 요청을 받아 서비스 계층에 위임하고, 결과를 JSON 형태로 반환합니다.
 */
@RestController // 이 클래스가 REST API 컨트롤러임을 명시
@RequestMapping("/raw-materials") // 공통 URL 경로 설정: /raw-materials로 시작하는 요청 처리
public class MaterialStockController {

    //  서비스 의존성 주입
    private MaterialStockService materialStockService;

    // 생성자 기반 의존성 주입
    @Autowired
    public MaterialStockController(MaterialStockService materialStockService) {
        this.materialStockService = materialStockService;
    }

    /**
     *  GET /raw-materials/inventory
     * - 전체 원자재 재고 현황을 조회합니다.
     * - MaterialStockDTO 리스트를 JSON 형태로 반환합니다.
     */
    @GetMapping("/inventory")
    public ResponseEntity<List<MaterialStockDTO>> findAllInventory() {
        // 서비스 계층에서 재고 데이터 조회
        List<MaterialStockDTO> materialStockDTOS = materialStockService.findAll();

        // HTTP 200 OK 응답과 함께 데이터 반환
        return ResponseEntity.ok(materialStockDTOS);
    }

}