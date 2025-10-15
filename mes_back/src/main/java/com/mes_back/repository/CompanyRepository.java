package com.mes_back.repository;

import com.mes_back.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    // 일반 페이지용 (status 값 "Y"일때 - 거래중 업체 | "N" 일때 거래 종료된 업체 & 삭제 안된 업체)
    List<Company> findByStatusAndDeletedAtIsNull(String status);

    // 업체 조회 페이지용 (삭제 안된 모든 업체)
    List<Company> findByDeletedAtIsNull();

    // 삭제된 업체 조회 페이지용
    List<Company> findByDeletedAtIsNotNull();
}

