package com.mes_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRoutingDTO {
    private Long id;
    private Long orderInboundId;
    private Long routingId;
    private Long processNo;
    private String step;
    private String description;
    private Integer duration;
}
