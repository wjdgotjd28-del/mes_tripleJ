package com.mes_back.service;

import com.mes_back.dto.MaterialItemDTO;
import com.mes_back.dto.MaterialItemRequestDTO;
import com.mes_back.entity.Company;
import com.mes_back.entity.MaterialItem;
import com.mes_back.repository.CompanyRepository;
import com.mes_back.repository.MasterDataRawItemsRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class MasterDataRawItemsService {

    private final MasterDataRawItemsRepository masterDataRawItemsRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;

    // 전체 조회
    public List<MaterialItemRequestDTO> getMaterialItem() {
        return masterDataRawItemsRepository.findAll()
            .stream()
            .map(this::convertToRequestDTO)
            .collect(Collectors.toList());
    }

    // 상세 조회
    public MaterialItemRequestDTO getMaterialItemById(Long id) {
        MaterialItem item = masterDataRawItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        return convertToRequestDTO(item);
    }

    // 등록
    public MaterialItemDTO createMaterialItem(MaterialItemRequestDTO requestDTO) {
        // 업체명으로 회사 조회
        Company company = companyRepository.findByCompanyName(requestDTO.getCompanyName())
                .orElseThrow(() -> new RuntimeException("해당 업체를 찾을 수 없습니다: " + requestDTO.getCompanyName()));

        // RequestDTO → Entity 변환
        MaterialItem materialItem = modelMapper.map(requestDTO, MaterialItem.class);

        // 회사 매핑
        materialItem.setCompany(company);

        // 저장
        MaterialItem savedItem = masterDataRawItemsRepository.save(materialItem);

        // 저장된 Entity → DTO 변환 후 반환
        MaterialItemDTO dto = modelMapper.map(savedItem, MaterialItemDTO.class);
        dto.setCompanyId(company.getCompanyId());
        return dto;
    }

    // 수정
    public MaterialItemDTO updateMaterialItem(Long id, MaterialItemRequestDTO requestDTO) {
        MaterialItem updatedItem = masterDataRawItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        // 회사 매핑
        Company company = companyRepository.findByCompanyName(requestDTO.getCompanyName())
                .orElseThrow(() -> new RuntimeException("해당 업체를 찾을 수 없습니다: " + requestDTO.getCompanyName()));
        updatedItem.setCompany(company);

        // 나머지 필드 매핑
        modelMapper.map(requestDTO, updatedItem);

        MaterialItem saved = masterDataRawItemsRepository.save(updatedItem);
        MaterialItemDTO dto = modelMapper.map(saved, MaterialItemDTO.class);
        dto.setCompanyId(company.getCompanyId());
        return dto;
    }

    // soft delete
    public void deleteMaterialItem(Long id) {
        masterDataRawItemsRepository.findById(id).ifPresent(item -> {
            item.setUseYn("N");
            masterDataRawItemsRepository.save(item);
        });
    }

    // 복원
    public MaterialItemDTO restoreMaterialItem(Long id) {
        MaterialItem item = masterDataRawItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        item.setUseYn("Y".equalsIgnoreCase(item.getUseYn()) ? "N" : "Y");
        MaterialItem saved = masterDataRawItemsRepository.save(item);

        MaterialItemDTO dto = modelMapper.map(saved, MaterialItemDTO.class);
        dto.setCompanyId(saved.getCompany().getCompanyId());
        return dto;
    }

    // Entity → RequestDTO 변환 (프론트용)
    private MaterialItemRequestDTO convertToRequestDTO(MaterialItem item) {
        MaterialItemRequestDTO dto = modelMapper.map(item, MaterialItemRequestDTO.class);
        dto.setCompanyName(item.getCompany().getCompanyName());
        return dto;
    }

}
