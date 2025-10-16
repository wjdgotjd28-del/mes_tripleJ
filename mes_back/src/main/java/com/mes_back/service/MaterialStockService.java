package com.mes_back.service;

import com.mes_back.dto.MaterialStockDTO;
import com.mes_back.entity.MaterialStock;
import com.mes_back.repository.MaterialStockRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor

public class MaterialStockService {

    private final MaterialStockRepository materialStockRepository;

    public List<MaterialStockDTO> findAll() {
        List<MaterialStock> stocks = materialStockRepository.findAll();

        return stocks.stream().map(ms -> {
            MaterialStockDTO dto = new MaterialStockDTO();
            dto.setId(ms.getId());
            dto.setCompanyName(ms.getMaterialItem().getCompany().getCompanyName());
            dto.setItemCode(ms.getMaterialItem().getItemCode());
            dto.setItemName(ms.getMaterialItem().getItemName());
            dto.setTotalQty(ms.getTotalQty().longValue()); // MaterialStock의 totalQty
            dto.setUnit(ms.getUnit());
            return dto;
        }).collect(Collectors.toList());
    }
}
