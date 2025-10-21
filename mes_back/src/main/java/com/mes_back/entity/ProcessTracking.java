package com.mes_back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "process_tracking")
@Getter
@Setter
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

    @Column(name = "process_start_time", nullable = true)
    private LocalDateTime processStartTime;

    @Column(name = "process_status", nullable = false)
    private Integer processStatus;

}