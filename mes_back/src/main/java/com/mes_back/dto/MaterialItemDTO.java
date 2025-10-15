package com.mes_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialItemDTO {
    private Long materialItemId;
    private Long companyId;
    private String itemName;
    private String itemCode;
    private String category; // 페인트, 신나, 세척제, 경화제
    private String color;
    private Long specQty;
    private String specUnit;
    private String manufacturer;
    private String note;
    private String useYn; // Y / N
}