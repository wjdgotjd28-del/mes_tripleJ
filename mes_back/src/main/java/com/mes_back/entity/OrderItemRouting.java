package com.mes_back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_item_routing")
@Getter
@Setter
public class OrderItemRouting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "routing_id", nullable = false)
    private Routing routing;

    @Column(name = "process_no", nullable = false)
    private Long processNo;
    private String step;
    private String description;
    private Integer duration;
}
