package com.mes_back.repository;

import com.mes_back.entity.MaterialItem;
import com.mes_back.entity.MaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaterialStockRepository extends JpaRepository<MaterialStock, Long> {

    Optional<MaterialStock> findByMaterialItem(MaterialItem materialItem);

}