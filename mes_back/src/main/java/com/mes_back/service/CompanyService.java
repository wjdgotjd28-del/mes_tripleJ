package com.mes_back.service;

import com.mes_back.dto.CompanyDTO;
import com.mes_back.entity.Company;
import com.mes_back.repository.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    // 회사 등록
    public CompanyDTO addCompany(CompanyDTO companyDto) {
        Company company = Company.builder()
                .type(companyDto.getType())
                .companyName(companyDto.getCompanyName())
                .ceoName(companyDto.getCeoName())
                .address(companyDto.getAddress())
                .note(companyDto.getNote())
                .bizRegNo(companyDto.getBizRegNo())
                .ceoPhone(companyDto.getCeoPhone())
                .managerName(companyDto.getManagerName())
                .managerPhone(companyDto.getManagerPhone())
                .managerEmail(companyDto.getManagerEmail())
                .status("Y")
                .build();
        Company savedCompany = companyRepository.save(company);
        companyDto.setCompanyId(savedCompany.getCompanyId());
        companyDto.setStatus(savedCompany.getStatus());
        return companyDto;
    }

    // 업체 조회 페이지용 (삭제 안된 모든 업체)
    @Transactional(readOnly = true)
    public List<CompanyDTO> findAll() {
        List<Company> companies = companyRepository.findByDeletedAtIsNull();
        return companies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 일반 페이지용 (거래중 & 삭제 안된 업체)
    @Transactional(readOnly = true)
    public List<CompanyDTO> findAllActive() {
        List<Company> companies = companyRepository.findByStatusAndDeletedAtIsNull("Y");
        return companies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 삭제된 업체 조회
    @Transactional(readOnly = true)
    public List<CompanyDTO> findAllDeleted() {
        List<Company> companies = companyRepository.findByDeletedAtIsNotNull();
        return companies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    // 회사 수정
    public CompanyDTO updateCompany(CompanyDTO companyDto) {
        Company company = companyRepository.findById(companyDto.getCompanyId())
                .orElseThrow(EntityNotFoundException::new);
        company.updateCompany(companyDto);
        return companyDto;
    }


    public CompanyDTO updateTradeStatus(Long companyId, String status) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(EntityNotFoundException::new);

        company.updateStatus(status);

        return CompanyDTO.builder()
                .companyId(company.getCompanyId())
                .status(company.getStatus())
                .build();
    }

    // 회사 삭제 (소프트)
    public void deleteCompany(Long companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new EntityNotFoundException("Company not found with id: " + companyId);
        }
        companyRepository.deleteById(companyId);
    }

    // 회사 복구
    public void restoreCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + companyId));

        company.restore();
    }

    // Entity -> DTO 변환 헬퍼
    private CompanyDTO convertToDto(Company company) {
        return CompanyDTO.builder()
                .companyId(company.getCompanyId())
                .type(company.getType())
                .companyName(company.getCompanyName())
                .ceoName(company.getCeoName())
                .address(company.getAddress())
                .note(company.getNote())
                .bizRegNo(company.getBizRegNo())
                .ceoPhone(company.getCeoPhone())
                .managerName(company.getManagerName())
                .managerPhone(company.getManagerPhone())
                .managerEmail(company.getManagerEmail())
                .status(company.getStatus())
                .build();
    }


    
}