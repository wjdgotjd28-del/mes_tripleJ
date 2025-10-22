package com.mes_back.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialInboundDTO {
    private Long id;
    private Long materialItemId;
    private String supplierName;
    private String itemName;
    private String itemCode;
    private Long specQty;
    private String specUnit;
    private String manufacturer;
    private LocalDateTime manufacteDate;
    private Long qty;
    private LocalDateTime inboundDate;
    private String inboundNo;
    private String totalQty;
}

