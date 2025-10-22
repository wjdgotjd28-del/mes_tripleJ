package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // 이미 모든 필드를 매개변수로 받는 생성자 생성
@NoArgsConstructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class MaterialStockDTO {
    private Long id;
    @JsonProperty("company_name")
    private String companyName;
    @JsonProperty("item_code")
    private String itemCode;
    @JsonProperty("item_name")
    private String itemName;
    @JsonProperty("total_qty")
    private Long totalQty;
    private String unit;
    private String manufacturer;
    @JsonProperty("material_inbound_id")
    private Long materialInboundId;
}
