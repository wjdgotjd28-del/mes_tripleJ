package com.mes_back.repository;

import com.mes_back.dto.OrderInboundDto;

import java.util.List;

public interface OrderInboundRepositoryCustom {
    List<OrderInboundDto> findInboundHistoriesForOutbound();
}
