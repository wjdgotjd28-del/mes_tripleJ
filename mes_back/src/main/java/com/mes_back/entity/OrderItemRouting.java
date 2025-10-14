package com.mes_back.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_item_routing")
public class OrderItemRouting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_inbound_id", nullable = false)
    private OrderInbound orderInbound;

    @ManyToOne
    @JoinColumn(name = "routing_id", nullable = false)
    private Routing routing;

    @Column(name = "process_no", nullable = false)
    private Long processNo;
}
