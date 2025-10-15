package com.mes_back.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialStockDTO {
    private Long id;
    private String companyName; // 매입처명
    private String itemCode;    // 품목번호
    private String itemName;    // 품목명
    private Integer totalQty;
    private String unit;
}
