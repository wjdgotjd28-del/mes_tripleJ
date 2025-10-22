package com.mes_back.controller;

import com.mes_back.dto.MaterialInboundDTO;
import com.mes_back.entity.MaterialInbound;
import com.mes_back.repository.MaterialInboundRepository;
import com.mes_back.service.MaterialInboundService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/materials/inbound")
@RestController
@RequiredArgsConstructor
public class MaterialInboundController {

    private final MaterialInboundService materialInboundService;

    @GetMapping("")
    public List<MaterialInboundDTO> getMaterialInbound() {
        return materialInboundService.getMaterialInbound();
    }

    @PostMapping("/new")
    public MaterialInboundDTO addMaterialInbound(@RequestBody MaterialInboundDTO materialInboundDto) {
        return materialInboundService.addMaterialInbound(materialInboundDto);
    }

    @PatchMapping("")
    public MaterialInboundDTO updateMaterialInbound(@RequestBody MaterialInboundDTO materialInboundDto) {
        return materialInboundService.updateMaterialInbound(materialInboundDto);
    }

    @DeleteMapping("/{id}")
    public Long deleteMaterialInbound(@PathVariable("id") Long id) {
        return materialInboundService.deleteMaterialInbound(id);
    }
}
