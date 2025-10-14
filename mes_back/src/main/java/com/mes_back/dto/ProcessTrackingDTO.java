package com.mes_back.dto;

import java.time.LocalDate;

public class ProcessTrackingDTO {
    private Long id;
    private Long orderInboundId;
    private Long orderItemRoutingId;
    private LocalDate processStartTime;
}
