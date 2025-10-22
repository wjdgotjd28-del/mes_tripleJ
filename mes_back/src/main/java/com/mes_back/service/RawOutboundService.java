package com.mes_back.service;

import com.mes_back.dto.MaterialOutboundDTO;
import com.mes_back.entity.MaterialInbound;
import com.mes_back.entity.MaterialItem;
import com.mes_back.entity.MaterialOutbound;
import com.mes_back.entity.MaterialStock;
import com.mes_back.repository.MaterialItemRepository;
import com.mes_back.repository.MaterialStockRepository;
import com.mes_back.repository.RawInboundRepository;
import com.mes_back.repository.RawOutboundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RawOutboundService {

    private final RawOutboundRepository outboundRepository;
    private final RawInboundRepository inboundRepository;
    private final MaterialStockRepository stockRepository;

    // ✅ 출고 전체 조회
    @Transactional(readOnly = true)
    public List<MaterialOutboundDTO> getAll() {
        return outboundRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ 출고 등록 (출고 시 재고 차감)
    public void add(MaterialOutboundDTO dto) {
        // 1️⃣ material_inbound_id로 MaterialInbound 조회
        MaterialInbound inbound = inboundRepository.findById(dto.getMaterialInboundId())
                .orElseThrow(() -> new RuntimeException("해당 품목을 찾을 수 없습니다."));

        // 2️⃣ 해당 MaterialItem 조회 (MaterialInbound -> MaterialItem)
        MaterialItem item = inbound.getMaterialItem();

        // 3️⃣ 재고 조회 및 차감
        MaterialStock stock = stockRepository.findByMaterialItem(item)
                .orElseThrow(() -> new RuntimeException("해당 품목의 재고 정보가 없습니다."));

        if (dto.getQty() > stock.getTotalQty()) {
            throw new RuntimeException("출고 수량이 재고 수량보다 많습니다.");
        }
//        long usedQty = dto.getQty() * item.getSpecQty();
        stock.setTotalQty(stock.getTotalQty() - dto.getQty());
        stockRepository.save(stock);

        // 4️⃣ 출고번호 자동 생성
        LocalDate today = LocalDate.now();
        Long count = outboundRepository.countByDate(today);

        String sequence = String.format("%03d", count + 1);
        String outboundNo = "MOUT-" + today.format(DateTimeFormatter.BASIC_ISO_DATE) + "-" + sequence;

        // 5️⃣ 출고 엔티티 생성
        MaterialOutbound outbound = new MaterialOutbound();
        outbound.setMaterialInbound(inbound);
        outbound.setSpecQty(item.getSpecQty());  // ✅ 여기서 MaterialItem의 specQty 사용
        outbound.setManufacturer(dto.getManufacturer());
        outbound.setQty(dto.getQty());
        outbound.setOutboundDate(dto.getOutboundDate() != null ? dto.getOutboundDate() : LocalDate.now());
        outbound.setOutboundNo(outboundNo);

        outboundRepository.save(outbound);
    }

    // ✅ 출고 수정
    public void update(Long id, MaterialOutboundDTO dto) {
        MaterialOutbound outbound = outboundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("출고 내역을 찾을 수 없습니다."));

        MaterialStock stock = stockRepository.findByMaterialItem(outbound.getMaterialInbound().getMaterialItem())
                .orElseThrow(() -> new RuntimeException("재고 정보를 찾을 수 없습니다."));

        // 1️⃣ 출고 수량 변경 시 재고 조정
        if (!outbound.getQty().equals(dto.getQty())) {
            long diff = dto.getQty() - outbound.getQty(); // 변경량
//            long adjustQty = diff * outbound.getSpecQty(); // 실제 재고 조정량

            long newStock = stock.getTotalQty() - diff;
            if (newStock < 0) {
                throw new RuntimeException("재고 수량이 부족합니다.");
            }
            stock.setTotalQty(newStock);
            stockRepository.save(stock);

            outbound.setQty(dto.getQty());
        }

        // 2️⃣ 출고일 변경 시 반영
        if (!outbound.getOutboundDate().equals(dto.getOutboundDate())) {
            outbound.setOutboundDate(dto.getOutboundDate());
        }

        // 3️⃣ 기타 변경 사항 필요 시 여기에 추가
        outboundRepository.save(outbound);
    }

    // ✅ 출고 삭제 (삭제 시 재고 복원)
    public void delete(Long id) {
        MaterialOutbound outbound = outboundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("출고 내역을 찾을 수 없습니다."));

        MaterialStock stock = stockRepository.findByMaterialItem(outbound.getMaterialInbound().getMaterialItem())
                .orElseThrow(() -> new RuntimeException("재고 정보를 찾을 수 없습니다."));

//        long restoreQty = outbound.getQty() * outbound.getSpecQty();
        stock.setTotalQty(stock.getTotalQty() + outbound.getQty());
        stockRepository.save(stock);

        outboundRepository.delete(outbound);
    }

    private MaterialOutboundDTO toDTO(MaterialOutbound entity) {
        MaterialOutboundDTO dto = new MaterialOutboundDTO();
        dto.setId(entity.getId());
        dto.setMaterialInboundId(entity.getMaterialInbound().getId());
        dto.setSpecQty(entity.getSpecQty());
        dto.setManufacturer(entity.getManufacturer());
        dto.setQty(entity.getQty());
        dto.setOutboundDate(entity.getOutboundDate());
        dto.setOutboundNo(entity.getOutboundNo());
        dto.setInboundDate(entity.getMaterialInbound().getInboundDate());
        dto.setCompanyName(entity.getMaterialInbound().getSupplierName());
        dto.setItemName(entity.getMaterialInbound().getItemName());
        dto.setItemCode(entity.getMaterialInbound().getItemCode());
        dto.setUnit(entity.getMaterialInbound().getMaterialItem().getSpecUnit());
        return dto;
    }
}
