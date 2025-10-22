package com.mes_back.service;

import com.mes_back.dto.MaterialInboundDTO;
import com.mes_back.entity.MaterialInbound;
import com.mes_back.entity.MaterialItem;
import com.mes_back.entity.MaterialStock;
import com.mes_back.repository.MaterialInboundRepository;
import com.mes_back.repository.MaterialItemRepository;
import com.mes_back.repository.MaterialStockRepository;
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
    private final MaterialItemRepository materialItemRepository;
    private final MaterialStockRepository materialStockRepository;

    @Transactional(readOnly = true)
    public List<MaterialInboundDTO> getMaterialInbound() {
        return materialInboundRepository.findAll().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    public MaterialInboundDTO addMaterialInbound(MaterialInboundDTO materialInboundDto) {
        // 1. MaterialItem 조회
        MaterialItem materialItem = materialItemRepository.findById(materialInboundDto.getMaterialItemId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "MaterialItem not found with id: " + materialInboundDto.getMaterialItemId()
                ));

        // 2. 입고번호 생성
        String inboundNo = generateInboundNo();

        // 3. 실제 입고량 계산 (입고 수량 * 규격(양))
        Long calculatedQty = materialInboundDto.getQty() * materialItem.getSpecQty();

        // 4. MaterialInbound 생성 및 저장
        MaterialInbound materialInbound = MaterialInbound.builder()
                .materialItem(materialItem)
                .supplierName(materialInboundDto.getSupplierName())
                .itemName(materialItem.getItemName())
                .itemCode(materialItem.getItemCode())
                .specQty(materialItem.getSpecQty())
                .specUnit(materialItem.getSpecUnit())
                .manufacturer(materialItem.getManufacturer())
                .manufacteDate(materialInboundDto.getManufacteDate())
                .qty(materialInboundDto.getQty())
                .inboundDate(materialInboundDto.getInboundDate())
                .inboundNo(inboundNo)
                .totalQty(calculatedQty)
                .build();

        MaterialInbound savedInbound = materialInboundRepository.save(materialInbound);

        // 5. MaterialStock 업데이트
        MaterialStock stock = materialStockRepository.findByMaterialInbound(savedInbound)
                .orElseGet(() -> {
                    MaterialStock newStock = new MaterialStock();
                    newStock.setMaterialInbound(savedInbound);
                    newStock.setUnit(materialItem.getSpecUnit());
                    newStock.setTotalQty(0L);
                    return newStock;
                });

        Long updatedTotal = (stock.getTotalQty() != null ? stock.getTotalQty() : 0L) + calculatedQty;
        stock.setTotalQty(updatedTotal);
        materialStockRepository.save(stock);

        // 6. DTO 반환
        return entityToDto(savedInbound);
    }

    // DTO 변환
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
                .qty(materialInbound.getQty()) // 입고수량(Long)
                .inboundDate(materialInbound.getInboundDate())
                .inboundNo(materialInbound.getInboundNo())
                .totalQty(materialInbound.getTotalQty()) // 단위 포함 String
                .build();
    }

    // 입고번호 생성
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
}
