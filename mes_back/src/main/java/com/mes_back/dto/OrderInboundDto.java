package com.mes_back.dto;

import com.mes_back.constant.OrderCategory;
import com.mes_back.constant.PaintType;
import com.mes_back.entity.OrderItem;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderInboundDto {

    private Long orderInboundId;

    private OrderItem orderItem;

    private String customerName;

    private String itemName;

    private String itemCode;

    private Long qty;

    private OrderCategory category;

    private String note;

    private LocalDate inboundDate;

    private String lotNo;

    private PaintType paintType;

}
