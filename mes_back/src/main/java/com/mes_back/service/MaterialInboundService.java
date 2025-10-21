package com.mes_back.service;

import com.mes_back.dto.MaterialInboundDTO;
import com.mes_back.entity.MaterialInbound;
import com.mes_back.entity.MaterialItem;
import com.mes_back.repository.MaterialInboundRepository;
import com.mes_back.repository.MaterialItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MaterialInboundService {

    private final MaterialInboundRepository materialInboundRepository;
    private final MaterialItemRepository materialItemRepository; // Repository 추가

    @Transactional(readOnly = true)
    public List<MaterialInboundDTO> getMaterialInbound() {
        return materialInboundRepository.findAll().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    public MaterialInboundDTO addMaterialInbound(MaterialInboundDTO materialInboundDto) {
        // 1. DTO에서 ID를 사용하여 MaterialItem 엔티티 조회
        MaterialItem materialItem = materialItemRepository.findById(materialInboundDto.getMaterialItemId())
                .orElseThrow(() -> new EntityNotFoundException("MaterialItem not found with id: " + materialInboundDto.getMaterialItemId()));

        // 2. MaterialInbound 엔티티 생성
        MaterialInbound materialInbound = MaterialInbound.builder()
                .materialItem(materialItem) // 조회된 엔티티 객체를 전달
                .supplierName(materialInboundDto.getSupplierName())
                .itemName(materialItem.getItemName()) // 마스터 데이터 이름 사용
                .itemCode(materialItem.getItemCode()) // 마스터 데이터 코드 사용
                .specQty(materialItem.getSpecQty())
                .specUnit(materialItem.getSpecUnit())
                .manufacturer(materialItem.getManufacturer())
                .manufacteDate(materialInboundDto.getManufacteDate())
                .qty(materialInboundDto.getQty())
                .inboundDate(materialInboundDto.getInboundDate())
                .inboundNo(materialInboundDto.getInboundNo())
                .totalQty(materialInboundDto.getTotalQty())
                .build();

        // 3. 엔티티 저장
        MaterialInbound savedInbound = materialInboundRepository.save(materialInbound);
        materialInboundDto.setId(savedInbound.getId());

        // 4. 저장된 엔티티를 DTO로 변환하여 반환
        return entityToDto(savedInbound);
    }

    // 엔티티를 DTO로 변환하는 헬퍼 메소드
    private MaterialInboundDTO entityToDto(MaterialInbound materialInbound) {
        return MaterialInboundDTO.builder()
                .id(materialInbound.getId())
                .materialItemId(materialInbound.getMaterialItem().getMaterialItemId())
                .supplierName(materialInbound.getSupplierName())
                .itemName(materialInbound.getItemName())
                .itemCode(materialInbound.getItemCode())
                .specQty(materialInbound.getSpecQty())
                .specUnit(materialInbound.getSpecUnit())
                .manufacturer(materialInbound.getManufacturer())
                .manufacteDate(materialInbound.getManufacteDate())
                .qty(materialInbound.getQty())
                .inboundDate(materialInbound.getInboundDate())
                .inboundNo(materialInbound.getInboundNo())
                .totalQty(materialInbound.getTotalQty())
                .build();
    }
}