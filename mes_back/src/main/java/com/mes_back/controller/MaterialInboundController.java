package com.mes_back.controller;

import com.mes_back.dto.MaterialInboundDTO;
import com.mes_back.entity.MaterialInbound;
import com.mes_back.repository.MaterialInboundRepository;
import com.mes_back.service.MaterialInboundService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
