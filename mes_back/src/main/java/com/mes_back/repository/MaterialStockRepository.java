package com.mes_back.repository;

import com.mes_back.entity.MaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialStockRepository extends JpaRepository<MaterialStock, Long> {

    /**
     * 특정 품목 이름(itemName)에 해당하는 MaterialItem과 연결된 MaterialStock 중
     * 첫 번째 데이터를 반환하는 메서드입니다.
     *
     * - 메서드 이름 규칙에 따라 자동으로 쿼리가 생성됩니다.
     * - MaterialStock → MaterialItem → itemName 경로를 따라 조건이 적용됩니다.
     * - 반환 타입은 MaterialStock이며, 여러 개가 있을 경우 첫 번째 하나만 반환합니다.
     */
    MaterialStock findFirstByMaterialItem_ItemName(String itemName);
}
