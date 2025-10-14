package com.mes_back.dto;

import java.time.LocalDate;

public class OrderInboundDTO {
    private Long orderInboundId;
    private Long orderItemId;
    private String customerName;
    private String itemName;
    private String itemCode;
    private Long qty;
    private String category; // 방산, 일반, 자동차, 조선
    private String note;
    private LocalDate inboundDate;
    private String lotNo;
    private String paintType; // POWDER / LIQUID
}

