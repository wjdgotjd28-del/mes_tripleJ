package com.mes_back.service;

import com.mes_back.repository.OrderOutboundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderOutboundService {

    private OrderOutboundRepository orderOutboundRepository;

}
