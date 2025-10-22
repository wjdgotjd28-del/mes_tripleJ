package com.mes_back.service;

import com.mes_back.dto.MaterialStockDTO;
import com.mes_back.entity.MaterialStock;
import com.mes_back.repository.MaterialStockRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class MaterialStockService {

    private final MaterialStockRepository materialStockRepository;

    // 기존 findAll() 유지
    public List<MaterialStockDTO> findAll() {
        List<MaterialStock> stocks = materialStockRepository.findAll();

        return stocks.stream().map(ms -> {
            MaterialStockDTO dto = new MaterialStockDTO();
            dto.setId(ms.getId());
            dto.setCompanyName(ms.getMaterialInbound().getMaterialItem().getCompany().getCompanyName());
            dto.setItemCode(ms.getMaterialInbound().getMaterialItem().getItemCode());
            dto.setItemName(ms.getMaterialInbound().getItemName());
            dto.setTotalQty(ms.getTotalQty());
            dto.setUnit(ms.getUnit());
            dto.setManufacturer(ms.getMaterialInbound().getManufacturer());
            dto.setMaterialInboundId(ms.getMaterialInbound().getId());
            return dto;
        }).collect(Collectors.toList());
    }

    // ✅ 품목별 총량 합산
    @Transactional(readOnly = true)
    public List<MaterialStockDTO> findTotalQtyByItem() {
        List<MaterialStock> stocks = materialStockRepository.findAll();

        // itemCode 기준으로 합산
        Map<String, MaterialStockDTO> totalMap = new HashMap<>();

        for (MaterialStock ms : stocks) {
            String key = ms.getMaterialInbound().getMaterialItem().getItemCode();
            MaterialStockDTO dto = totalMap.getOrDefault(key, new MaterialStockDTO());
            dto.setCompanyName(ms.getMaterialInbound().getMaterialItem().getCompany().getCompanyName());
            dto.setItemCode(ms.getMaterialInbound().getMaterialItem().getItemCode());
            dto.setItemName(ms.getMaterialInbound().getItemName());
            dto.setUnit(ms.getUnit());
            dto.setTotalQty((dto.getTotalQty() == null ? 0 : dto.getTotalQty()) + ms.getTotalQty());
            dto.setManufacturer(ms.getMaterialInbound().getManufacturer());
            dto.setMaterialInboundId(ms.getMaterialInbound().getId());
            totalMap.put(key, dto);
        }

        return new ArrayList<>(totalMap.values());
    }
}
