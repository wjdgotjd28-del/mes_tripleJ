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

    

        // JPQL 프로젝션을 위한 생성자

        public OrderInboundDto(Long orderInboundId, String lotNo, String customerName, String itemName, String itemCode, LocalDate inboundDate, Long qty, OrderCategory category) {

            this.orderInboundId = orderInboundId;

            this.lotNo = lotNo;

            this.customerName = customerName;

            this.itemName = itemName;

            this.itemCode = itemCode;

            this.inboundDate = inboundDate;

            this.qty = qty;

            this.category = category;

        }

    }
