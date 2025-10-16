package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRoutingDTO {

    private Long id;

    @JsonProperty("order_item_id")
    private Long orderItemId;

    @JsonProperty("routing_id")
    private Long routingId;

    @JsonProperty("process_no")
    private Long processNo;

    @JsonProperty("process_code")
    private String processCode;
    @JsonProperty("process_name")
    private String processName;
    @JsonProperty("process_time")
    private String processTime;
    private String note;
}
