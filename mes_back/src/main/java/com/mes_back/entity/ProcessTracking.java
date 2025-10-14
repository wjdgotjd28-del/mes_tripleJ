package com.mes_back.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "process_tracking")
public class ProcessTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_inbound_id", nullable = false)
    private OrderInbound orderInbound;

    @ManyToOne
    @JoinColumn(name = "order_item_routing_id", nullable = false)
    private OrderItemRouting orderItemRouting;

    @Column(name = "process_start_time", nullable = false)
    private LocalDate processStartTime;
}