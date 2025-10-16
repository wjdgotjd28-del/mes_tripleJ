package com.mes_back.repository;

import com.mes_back.entity.MaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialStockRepository extends JpaRepository<MaterialStock, Long> {
    MaterialStock findFirstByMaterialItem_ItemName(String itemName);
}