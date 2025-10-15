package com.mes_back.service;

import com.mes_back.dto.CompanyDto;
import com.mes_back.entity.Company;
import com.mes_back.entity.repository.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    // 회사 등록
    public CompanyDto addCompany(CompanyDto companyDto) {
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

    // 회사 전체 조회
    public List<CompanyDto> findAll() {
        List<CompanyDto> companyDtos = new ArrayList<>();
        for (Company company : companyRepository.findAll()) {
            CompanyDto companyDto = CompanyDto.builder()
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
            companyDtos.add(companyDto);
        }
        return companyDtos;
    }

    // 회사 수정
    public CompanyDto updateCompany(CompanyDto companyDto) {
        Company company = companyRepository.findById(companyDto.getCompanyId())
                .orElseThrow(EntityNotFoundException::new);
        company.updateCompany(companyDto);
        return companyDto;

    }


}
