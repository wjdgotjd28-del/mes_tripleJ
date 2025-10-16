package com.mes_back.controller;

import com.mes_back.service.OrderOutboundService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/orderitem/outbound")
@RestController
@RequiredArgsConstructor
public class OrderOutboundController {

    private OrderOutboundService orderOutboundService;

    @PostMapping



}
