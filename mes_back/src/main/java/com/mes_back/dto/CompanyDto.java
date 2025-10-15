package com.mes_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyDto {
    private Long companyId;

    private String type; // 거래처 / 매입처

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

