package com.mes_back.controller;

import com.mes_back.dto.MaterialItemDTO;
import com.mes_back.dto.MaterialItemRequestDTO;
import com.mes_back.service.MasterDataRawItemsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@Slf4j
public class MasterDataRawItemsController {

    private final MasterDataRawItemsService masterDataRawItemsService;

    // 원자재 품목 조회
    @GetMapping("/raw")
    public List<MaterialItemRequestDTO> getRawItems() {
        return masterDataRawItemsService.getMaterialItem();
    }

    // 원자재 품목 상세 조회
    @GetMapping("/raw/dtl/{id}")
    public ResponseEntity<MaterialItemRequestDTO> getRawItemById(@PathVariable Long id) {
        MaterialItemRequestDTO dto = masterDataRawItemsService.getMaterialItemById(id);
        return ResponseEntity.ok(dto);
    }

    // 원자재 품목 등록
    @PostMapping("/raw/new")
    public ResponseEntity<MaterialItemDTO> createRawItem(@RequestBody MaterialItemRequestDTO materialItemRequestDTO) {
        MaterialItemDTO savedItem = masterDataRawItemsService.createMaterialItem(materialItemRequestDTO);
        return ResponseEntity.ok(savedItem);
    }

    // 원자재 품목 수정
    @PutMapping("/raw/{id}")
    public ResponseEntity<MaterialItemDTO> updateRawItem(
            @PathVariable Long id, @RequestBody MaterialItemRequestDTO requestDTO) {
        MaterialItemDTO updatedItem = masterDataRawItemsService.updateMaterialItem(id, requestDTO);
        return ResponseEntity.ok(updatedItem);
    }

    // 원자재 품목 삭제
    @DeleteMapping("/raw/delete/{id}")
    public ResponseEntity<String> deleteRawItem(@PathVariable Long id) {
        masterDataRawItemsService.deleteMaterialItem(id);
        return ResponseEntity.ok("삭제 완료");
    }

    // 원자재 품목 사용여부 복원
    @PostMapping("/raw/{id}")
    public ResponseEntity<MaterialItemDTO> toggleUseYn(@PathVariable Long id) {
        MaterialItemDTO updated = masterDataRawItemsService.restoreMaterialItem(id);
        return ResponseEntity.ok(updated);
    }
}
