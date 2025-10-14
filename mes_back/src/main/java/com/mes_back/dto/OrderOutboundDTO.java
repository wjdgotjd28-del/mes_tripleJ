package com.mes_back.dto;

import java.time.LocalDate;

public class OrderOutboundDTO {
    private Long id;
    private Long orderInboundId;
    private String customerName;
    private String itemName;
    private String itemCode;
    private Long qty;
    private String category; // 방산, 일반, 자동차, 조선
    private String outboundNo;
    private LocalDate outboundDate;
}