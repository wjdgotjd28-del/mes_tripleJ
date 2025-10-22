package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MaterialOutboundDTO {
    private Long id;
    @JsonProperty("material_inbound_id")
    private Long materialInboundId;
    @JsonProperty("spec_qty")
    private Long specQty;
    private String manufacturer;
    private Long qty;
    @JsonProperty("inbound_date")
    private LocalDateTime inboundDate;
    @JsonProperty("outbound_no")
    private String outboundNo;
    @JsonProperty("outbound_date")
    private LocalDateTime outboundDate;
    private String unit;
    @JsonProperty("company_name")
    private String companyName;
    @JsonProperty("item_name")
    private String itemName;
    @JsonProperty("item_code")
    private String itemCode;
}
