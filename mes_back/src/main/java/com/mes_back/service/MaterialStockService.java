package com.mes_back.service;

import com.mes_back.dto.MaterialStockDTO;
import com.mes_back.entity.MaterialItem;
import com.mes_back.repository.MaterialStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaterialStockService {

    private final MaterialStockRepository materialStockRepository;

    public MaterialStockService(MaterialStockRepository materialStockRepository) {
        this.materialStockRepository = materialStockRepository;
    }

    public List<MaterialStockDTO> findAll() {
        return materialStockRepository.findAll().stream().map(stock -> {
            MaterialItem item = stock.getMaterialItem();

            MaterialStockDTO dto = new MaterialStockDTO();
            dto.setId(stock.getId());
            dto.setCompanyName(item.getCompany().getCompanyName());
            dto.setItemCode(item.getItemCode());
            dto.setItemName(item.getItemName());
            dto.setTotalQty(stock.getTotalQty());
            dto.setUnit(stock.getUnit());

            return dto;
        }).collect(Collectors.toList());
    }
}


