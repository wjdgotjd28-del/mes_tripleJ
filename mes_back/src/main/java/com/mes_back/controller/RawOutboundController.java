package com.mes_back.controller;

import com.mes_back.dto.MaterialOutboundDTO;
import com.mes_back.service.RawOutboundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/raw/outbound")
public class RawOutboundController {

    private final RawOutboundService outboundService;

    // ✅ 전체 조회
    @GetMapping
    public ResponseEntity<List<MaterialOutboundDTO>> getAll() {
        return ResponseEntity.ok(outboundService.getAll());
    }

    // ✅ 등록
    @PostMapping
    public ResponseEntity<Void> add(@RequestBody MaterialOutboundDTO dto) {
        outboundService.add(dto);
        return ResponseEntity.ok().build();
    }

    // ✅ 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody MaterialOutboundDTO dto) {
        outboundService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    // ✅ 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        outboundService.delete(id);
        return ResponseEntity.ok().build();
    }

}
