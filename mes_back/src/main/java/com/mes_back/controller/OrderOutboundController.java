package com.mes_back.controller;

import com.mes_back.dto.OrderOutboundDto;
import com.mes_back.entity.OrderOutbound;
import com.mes_back.service.OrderOutboundService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/orderitem/outbound")
@RestController
@RequiredArgsConstructor
public class OrderOutboundController {

    private final OrderOutboundService orderOutboundService;

    @PostMapping("/new")
    public OrderOutboundDto addOrderOutbound( @RequestBody OrderOutboundDto orderOutboundDto){
        return orderOutboundService.addOrderOutbound(orderOutboundDto);
    }

    @GetMapping("")
    public List<OrderOutboundDto> getAllOrderOutbound(){
        return orderOutboundService.findAll();
    }

    @PatchMapping("")
    public OrderOutboundDto updateOrderOutbound(@RequestBody OrderOutboundDto orderOutboundDto){
        return orderOutboundService.updateOrderOutbound(orderOutboundDto);
    }
}