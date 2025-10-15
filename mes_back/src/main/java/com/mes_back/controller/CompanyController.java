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


    @PostMapping("/new")
    public CompanyDto addCompany(@RequestBody CompanyDto companyDto) {
        return companyService.addCompany(companyDto);
    }

    @GetMapping("")
    public List<CompanyDto> getCompanies() {
        return companyService.findAll();
    }

    @PutMapping("")
    public CompanyDto updateCompany(@RequestBody CompanyDto companyDto) {
        return companyService.updateCompany(companyDto);
    }

    @PatchMapping("/{companyId}/updateTradeStatus")
    public ResponseEntity<CompanyDto> updateTradeStatus(@PathVariable Long companyId, @RequestBody CompanyDto companyDto) {
         CompanyDto newStatus = companyService.updateTradeStatus(companyId, companyDto.getStatus());
         return ResponseEntity.ok(newStatus);
    }


}
