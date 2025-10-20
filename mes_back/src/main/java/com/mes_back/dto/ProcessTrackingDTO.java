package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ProcessTrackingDTO {

    private Long id;
    @JsonProperty("order_inbound_id")
    private Long orderInboundId;
    @JsonProperty("order_item_routing_id")
    private Long orderItemRoutingId;
    @JsonProperty("order_item_id")
    private Long orderItemId;
    @JsonProperty("process_name")
    private String processName;   // Routing.process_name
    @JsonProperty("process_time")
    private Integer processTime;   // Routing.process_time
    @JsonProperty("process_start_time")
    private LocalDateTime processStartTime;
    @JsonProperty("process_status")
    private Integer processStatus;
    @JsonProperty("process_no")
    private Integer processNo;
}
