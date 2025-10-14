package com.mes_back.dto;

public class OrderItemDTO {
    private Long orderItemId;
    private Long companyId;
    private String itemName;
    private String itemCode;
    private String category; // 방산, 일반, 자동차, 조선
    private String color;
    private Long unitPrice;
    private String paintType; // POWDER / LIQUID
    private String note;
    private String useYn; // Y / N
    private String status; // Y / N
}
