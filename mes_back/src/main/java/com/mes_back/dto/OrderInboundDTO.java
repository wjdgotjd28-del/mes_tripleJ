package com.mes_back.dto;

import com.mes_back.constant.OrderCategory;
import com.mes_back.constant.PaintType;
import com.mes_back.entity.OrderItem;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mes_back.constant.OrderCategory;
import com.mes_back.constant.PaintType;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderInboundDTO {

    @JsonProperty("order_inbound_id")
    private Long orderInboundId; // 입고 PK

    @JsonProperty("order_item_id")
    private Long orderItemId; // 수주 품목 ID

    @JsonProperty("category")
    private OrderCategory category; // 품목 분류

    @JsonProperty("customer_name")
    private String customerName; // 거래처명

    @JsonProperty("inbound_date")
    private LocalDate inboundDate; // 입고일자

    @JsonProperty("item_code")
    private String itemCode; // 품목코드

    @JsonProperty("item_name")
    private String itemName; // 품목명

    @JsonProperty("lot_no")
    private String lotNo; // 로트번호

    @JsonProperty("note")
    private String note; // 비고

    @JsonProperty("paint_type")
    private PaintType paintType; // 도장방식

    @JsonProperty("qty")
    private Long qty; // 입고 수량

    private Integer processStatus;

    public OrderInboundDTO(Long orderInboundId, String lotNo, String customerName, String itemName, String itemCode, LocalDate inboundDate, Long qty, OrderCategory category, Integer processStatus) {
        this.orderInboundId = orderInboundId;
        this.lotNo = lotNo;
        this.customerName = customerName;
        this.itemName = itemName;
        this.itemCode = itemCode;
        this.inboundDate = inboundDate;
        this.qty = qty;
        this.category = category;
        this.processStatus = processStatus;
    }
}
