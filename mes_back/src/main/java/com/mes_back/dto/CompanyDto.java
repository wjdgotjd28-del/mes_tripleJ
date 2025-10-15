package com.mes_back.dto;


import com.mes_back.constant.CompanyType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {
    private Long companyId;

    private CompanyType type; // 거래처 / 매입처

    private String companyName;

    private String ceoName;

    private String address;

    private String note;

    private String bizRegNo;

    private String ceoPhone;

    private String managerName;

    private String managerPhone;

    private String managerEmail;

    private String status; // Y / N
}

