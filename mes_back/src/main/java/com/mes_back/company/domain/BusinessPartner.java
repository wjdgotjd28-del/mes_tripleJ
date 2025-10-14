package com.mes_back.company.domain;

import jakarta.persistence.*;

public class BusinessPartner {

    // 업체 id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    // 업체유형
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CompanyType type;

    // 업체명
    @Column(name = "company_name", length = 255, nullable = false)
    private String companyName;

    // 대표명
    @Column(name = "ceo_name", length = 10, nullable = false)
    private String ceoName;

    // 주소
    @Column(name = "address", length = 255, nullable = false)
    private String address;

    // 비고
    @Column(name = "note", length = 255)
    private String note;

    // 사업자 등록번호
    @Column(name = "biz_reg_no", length = 13, nullable = false)
    private String bizRegNo;

    // 대표 전화번호
    @Column(name = "ceo_phone", length = 15, nullable = false)
    private String ceoPhone;

    // 담당자명
    @Column(name = "manager_name", length = 10, nullable = false)
    private String managerName;

    // 담당자 전화번호
    @Column(name = "manager_phone", length = 15, nullable = false)
    private String managerPhone;

    // 담당자 이메일
    @Column(name = "manager_email", length = 255, nullable = false)
    private String managerEmail;

    // 거래 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 1, nullable = false)
    private StatusType status;



}
