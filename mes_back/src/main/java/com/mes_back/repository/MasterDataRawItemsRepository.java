package com.mes_back.repository;

import com.mes_back.entity.MaterialItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MasterDataRawItemsRepository extends JpaRepository<MaterialItem, Long> {

//    List<MaterialItem> getMaterialItem();
}
