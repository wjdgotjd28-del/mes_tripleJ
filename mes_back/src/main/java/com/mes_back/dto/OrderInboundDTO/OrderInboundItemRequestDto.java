package com.mes_back.dto.OrderInboundDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mes_back.constant.OrderCategory;
import com.mes_back.constant.PaintType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderInboundItemRequestDto {
    @JsonProperty("order_item_id")
    private Long orderItemId;

    @JsonProperty("customer_name")
    private String customerName;

    @JsonProperty("item_code")
    private String itemCode;

    @JsonProperty("item_name")
    private String itemName;

    private Long qty;

    private OrderCategory category;

    private String note;

    @JsonProperty("inbound_date")
    private LocalDate inboundDate;

    @JsonProperty("lot_no")
    private String lotNo;

    @JsonProperty("paint_type")
    private PaintType paintType;
}