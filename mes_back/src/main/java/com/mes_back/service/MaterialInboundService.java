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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
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

        // 2. 입고번호 생성
        String inboundNo = generateInboundNo();

        // 3. MaterialInbound 엔티티 생성
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
                .inboundNo(inboundNo) // 생성된 입고번호 사용
                .totalQty(String.valueOf(materialInboundDto.getQty() * materialItem.getSpecQty()) + materialItem.getSpecUnit())
                .build();

        // 4. 엔티티 저장
        MaterialInbound savedInbound = materialInboundRepository.save(materialInbound);

        // 5. 저장된 엔티티를 DTO로 변환하여 반환
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
                .totalQty(String.valueOf(materialInbound.getQty() * materialInbound.getSpecQty()) + materialInbound.getSpecUnit())
                .build();
    }

    protected String generateInboundNo() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "MINC-" + today + "-";

        Optional<String> lastNoOptional = materialInboundRepository.findMaxInboundNoNative(prefix);
        int nextSeq = 1;
        if (lastNoOptional.isPresent()) {
            String lastNo = lastNoOptional.get();
            String lastSeq = lastNo.substring(lastNo.lastIndexOf("-") + 1);
            nextSeq = Integer.parseInt(lastSeq) + 1;
        }

        if (nextSeq > 999) throw new IllegalStateException("입고번호가 999를 초과했습니다.");

        return prefix + String.format("%03d", nextSeq);
    }

    public MaterialInboundDTO updateMaterialInbound(MaterialInboundDTO materialInboundDto) {
        MaterialInbound materialInbound = materialInboundRepository.findById(materialInboundDto.getId())
                .orElseThrow(EntityNotFoundException::new);
        materialInbound.updateMaterialInbound(materialInboundDto);
        return materialInboundDto;
    }
}