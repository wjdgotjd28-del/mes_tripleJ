package com.mes_back.dto;

import com.mes_back.constant.OrderCategory;
import com.mes_back.entity.OrderInbound;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderOutboundDto {
    private Long id;
    private OrderInbound orderInbound;   // ✅ 엔티티와 동일하게 객체 참조로 변경
    private String customerName;
    private String itemName;
    private String itemCode;
    private Long qty;
    private OrderCategory category;      // ✅ 엔티티와 동일하게 Enum 타입으로 변경
    private String outboundNo;
    private LocalDate outboundDate;
}

