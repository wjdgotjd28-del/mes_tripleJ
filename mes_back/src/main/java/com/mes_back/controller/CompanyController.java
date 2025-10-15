package com.mes_back.controller;

import com.mes_back.dto.CompanyDto;
import com.mes_back.entity.Company;
import com.mes_back.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/companies")
@RestController
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    // 업체 등록
    @PostMapping("/new")
    public CompanyDto addCompany(@RequestBody CompanyDto companyDto) {
        return companyService.addCompany(companyDto);
    }

    // 업체 조회
    @GetMapping("")
    public List<CompanyDto> getCompanies() {
        return companyService.findAll();
    }

    // 업체 수정
    @PutMapping("")
    public CompanyDto updateCompany(@RequestBody CompanyDto companyDto) {
        return companyService.updateCompany(companyDto);
    }

    // 거래 상태 버튼 클릭 -> 거래 상태 변경
    @PatchMapping("/{companyId}/updateTradeStatus")
    public ResponseEntity<CompanyDto> updateTradeStatus(@PathVariable Long companyId, @RequestBody CompanyDto companyDto) {
         CompanyDto newStatus = companyService.updateTradeStatus(companyId, companyDto.getStatus());
         return ResponseEntity.ok(newStatus);
    }

    // 일반 페이지용 (거래중 & 삭제 안된 업체)
    @GetMapping("/active")
    public List<CompanyDto> getActiveCompanies() {
        return companyService.findAllActive();
    }

    // 삭제된 업체 조회
    @GetMapping("/deleted")
    public List<CompanyDto> getDeletedCompanies() {
        return companyService.findAllDeleted();
    }

    // 업체 삭제 (소프트)
    @DeleteMapping("/{companyId}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long companyId) {
        companyService.deleteCompany(companyId);
        return ResponseEntity.ok().build();
    }

    // 업체 복구
    @PostMapping("/{companyId}/restore")
    public ResponseEntity<Void> restoreCompany(@PathVariable Long companyId) {
        companyService.restoreCompany(companyId);
        return ResponseEntity.ok().build();
    }


}
