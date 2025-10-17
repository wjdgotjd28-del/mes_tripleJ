package com.mes_back.dto.OrderInboundDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mes_back.constant.OrderCategory;
import com.mes_back.constant.PaintType;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor

public class OrderInboundHistoryResponseDto {

    @JsonProperty("order_inbound_id")
    private Long orderInboundId;

    @JsonProperty("order_item_id")
    private Long orderItemId;

    @JsonProperty("customer_name")
    private String customerName;

    @JsonProperty("item_name")
    private String itemName;

    @JsonProperty("item_code")
    private String itemCode;

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