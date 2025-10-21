package com.mes_back.entity;

import com.mes_back.constant.OrderCategory;
import com.mes_back.constant.PaintType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "order_inbound")
public class OrderInbound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_inbound_id")
    private Long orderInboundId;

    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "item_code", nullable = false, length = 255)
    private String itemCode;

    @Column(nullable = false)
    private Long qty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderCategory category;

    @Column(length = 255)
    private String note;

    @Column(name = "inbound_date", nullable = false)
    private LocalDate inboundDate;

    @Column(name = "lot_no", nullable = false, length = 20)
    private String lotNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "paint_type", nullable = false)
    private PaintType paintType;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

}
