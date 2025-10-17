package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class OrderItemDTO {
    @JsonProperty("order_item_id")
    private Long orderItemId;
    @JsonProperty("company_id")
    private Long companyId;
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
    private String useYn; // Y / N
    private String status; // Y / N

//    private List<OrderItemImgDTO> images;  // 이미지 리스트 추가
//    private List<OrderItemRoutingDTO> routing;  // 라우팅 리스트 추가
}
