package com.mes_back.service;

import com.mes_back.dto.MaterialInboundDTO;
import com.mes_back.entity.MaterialInbound;
import com.mes_back.repository.MaterialInboundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MaterialInboundService {

    private final MaterialInboundRepository materialInboundRepository;

    public List<MaterialInboundDTO> getMaterialInbound() {
        List<MaterialInboundDTO> materialInboundDtoList = new ArrayList<>();
        for (MaterialInbound materialInbound : materialInboundRepository.findAll()) {
            MaterialInboundDTO materialInboundDto = MaterialInboundDTO.builder()
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
            materialInboundDtoList.add(materialInboundDto);
        }
        return materialInboundDtoList;
    }
}
