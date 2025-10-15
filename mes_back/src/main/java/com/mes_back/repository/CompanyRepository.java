package com.mes_back.repository;

import com.mes_back.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByCompanyName(String companyName);

}
