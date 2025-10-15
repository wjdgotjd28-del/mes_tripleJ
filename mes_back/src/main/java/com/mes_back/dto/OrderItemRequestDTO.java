package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderItemRequestDTO {
    @JsonProperty("order_item_id")
    private Long orderItemId;
    @JsonProperty("company_name")
    private String companyName;
    @JsonProperty("item_name")
    private String itemName;
    @JsonProperty("item_code")
    private String itemCode;
    private String category; // 방산, 일반, 자동차, 조선
    private String color;
    @JsonProperty("unit_price")
    private Long unitPrice;
    @JsonProperty("paint_type")
    private String paintType; // POWDER / LIQUID
    private String note;
    @JsonProperty("use_yn")
    private String useYn; // Y / N
    private String status; // Y / N

    private List<OrderItemRoutingDTO> routing; // 선택된 라우팅
    private List<OrderItemImgDTO> image;       // 업로드 이미지
}
