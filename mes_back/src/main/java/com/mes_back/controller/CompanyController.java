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


}
