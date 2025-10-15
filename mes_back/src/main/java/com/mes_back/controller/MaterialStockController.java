package com.mes_back.controller;

import com.mes_back.dto.MaterialStockDTO;
import com.mes_back.service.MaterialStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/raw-materials")

public class MaterialStockController {

    private MaterialStockService materialStockService;

    @Autowired
    public MaterialStockController(MaterialStockService materialStockService) {
        this.materialStockService = materialStockService;
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<MaterialStockDTO>> findAllInventory() {
        List<MaterialStockDTO> materialStockDTOS = materialStockService.findAll();
        return ResponseEntity.ok(materialStockDTOS);
    }


}
