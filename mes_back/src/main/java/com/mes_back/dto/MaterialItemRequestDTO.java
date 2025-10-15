package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialItemRequestDTO {
    @JsonProperty("material_item_id")
    private Long materialItemId;
    @JsonProperty("item_name")
    private String itemName;
    @JsonProperty("company_name")
    private String companyName; // 프론트에서 넘어오는 업체명
    @JsonProperty("item_code")
    private String itemCode;
    private String category;
    private String color;
    @JsonProperty("spec_qty")
    private Long specQty;
    @JsonProperty("spec_unit")
    private String specUnit;
    private String manufacturer;
    private String note;
    @JsonProperty("use_yn")
    private String useYn;
}
