package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MaterialStockDTO {
    private Long id;

    @JsonProperty("company_name")
    private String companyName; // 매입처명

    @JsonProperty("item_code")
    private String itemCode;    // 품목번호

    @JsonProperty("item_name")
    private String itemName;    // 품목명

    @JsonProperty("spec_qty")
    private Integer specQty; // MaterialItem의 spec_qty

    @JsonProperty("total_qty")
    private Integer totalQty; //MaterialStock의 totalQty

    private String unit;
}
