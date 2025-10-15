package com.mes_back.entity;

import com.mes_back.constant.CompanyType;
import com.mes_back.dto.CompanyDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CompanyType type; // ENUM: 거래처 / 매입처

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "ceo_name", nullable = false, length = 10)
    private String ceoName;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "note", length = 255)
    private String note;

    @Column(name = "biz_reg_no", nullable = false, length = 12)
    private String bizRegNo;

    @Column(name = "ceo_phone", length = 15)
    private String ceoPhone;

    @Column(name = "manager_name", length = 10)
    private String managerName;

    @Column(name = "manager_phone", length = 15)
    private String managerPhone;

    @Column(name = "manager_email", length = 30)
    private String managerEmail;

    @Column(name = "status", nullable = false, length = 1)
    private String status; // 거래상태: Y/N

    public void updateCompany(CompanyDto companyDto) {
        this.type = companyDto.getType();
        this.companyName = companyDto.getCompanyName();
        this.ceoName = companyDto.getCeoName();
        this.address = companyDto.getAddress();
        this.note = companyDto.getNote();
        this.bizRegNo = companyDto.getBizRegNo();
        this.ceoPhone = companyDto.getCeoPhone();
        this.managerName = companyDto.getManagerName();
        this.managerPhone = companyDto.getManagerPhone();
        this.managerEmail = companyDto.getManagerEmail();
        this.status = companyDto.getStatus();

    }

    public void updateStatus(String status) {
        this.status = status;
    }
}