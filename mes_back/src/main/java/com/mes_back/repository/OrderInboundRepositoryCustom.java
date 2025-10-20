package com.mes_back.repository;


import com.mes_back.dto.OrderInboundDTO;

import java.util.List;

public interface OrderInboundRepositoryCustom {
    List<OrderInboundDTO> findInboundHistoriesForOutbound();
}
