package com.mes_back.dto;

import com.mes_back.constant.OrderCategory;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderOutboundDto {
    private Long id;
    private Long orderInboundId;
    private String customerName;
    private String itemName;
    private String itemCode;
    private Long qty;
    private OrderCategory category;
    private String outboundNo;
    private LocalDate outboundDate;
}