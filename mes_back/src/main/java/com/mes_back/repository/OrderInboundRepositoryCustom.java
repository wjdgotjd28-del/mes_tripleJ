package com.mes_back.repository;

import com.mes_back.dto.OrderInboundDTO;

import java.util.List;

public interface OrderInboundRepositoryCustom {
    List<OrderInboundDTO> findInboundHistoriesForOutbound();

    // LOT번호 생성용: 오늘 날짜 기준 가장 큰 LOT번호 조회
    String findLastLotNoByInboundDate(String datePrefix);
}