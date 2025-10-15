package com.mes_back.repository;

import com.mes_back.entity.Routing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutingRepository extends JpaRepository<Routing, Long> {

    /** 중복확인
      주어진 공정 코드(processCode)가 이미 존재하는지 여부를 확인합니다.
      @param processCode 확인할 공정 코드
      @return 해당 공정 코드가 존재하면 true, 아니면 false
     */
    boolean existsByProcessCode(String processCode);
}
