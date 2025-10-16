package com.mes_back.repository;

import com.mes_back.entity.MaterialItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialItemRepository extends JpaRepository<MaterialItem, Long> {
}
