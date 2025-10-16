package com.mes_back.service;

import com.mes_back.dto.MaterialStockDTO;
import com.mes_back.entity.MaterialItem;
import com.mes_back.entity.MaterialStock;
import com.mes_back.repository.MaterialItemRepository;
import com.mes_back.repository.MaterialStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaterialStockService {

    private final MaterialStockRepository materialStockRepository;
    private final MaterialItemRepository materialItemRepository;

    public MaterialStockService(MaterialStockRepository materialStockRepository,
                                MaterialItemRepository materialItemRepository) {
        this.materialStockRepository = materialStockRepository;
        this.materialItemRepository = materialItemRepository;
    }

    public List<MaterialStockDTO> findAll() {
        List<MaterialItem> items = materialItemRepository.findAll();

        return items.stream()
                .collect(Collectors.groupingBy(MaterialItem::getItemName))
                .entrySet().stream()
                .map(entry -> {
                    List<MaterialItem> groupedItems = entry.getValue();
                    MaterialItem firstItem = groupedItems.get(0);

                    // 해당 품목에 연결된 MaterialStock 중 하나를 가져오기
                    MaterialStock stock = materialStockRepository.findFirstByMaterialItem_ItemName(firstItem.getItemName());
                    MaterialStockDTO dto = new MaterialStockDTO();
                    dto.setId(stock != null ? stock.getId() : null); // ✅ MaterialStock의 ID
                    dto.setCompanyName(firstItem.getCompany().getCompanyName());
                    dto.setItemCode(firstItem.getItemCode());
                    dto.setItemName(firstItem.getItemName());
                    dto.setUnit(firstItem.getSpecUnit());
                    dto.setTotalQty(groupedItems.stream().mapToInt(MaterialItem::getSpecQty).sum());

                    return dto;
                })
                .collect(Collectors.toList());
    }

}


