package com.mes_back.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routing_id", nullable = false)
    private Routing routing;

    @Column(name = "process_no", nullable = false)
    private Long processNo;

    // JSON 직렬화를 위한 헬퍼 메서드 추가
    @JsonProperty("order_item_id")
    public Long getOrderItemId() {
        return orderItem != null ? orderItem.getOrderItemId() : null;
    }

    @JsonProperty("routing_id")
    public Long getRoutingId() {
        return routing != null ? routing.getRoutingId() : null;
    }

    @JsonProperty("process_code")
    public String getProcessCode() {
        return routing != null ? routing.getProcessCode() : null;
    }

    @JsonProperty("process_name")
    public String getProcessName() {
        return routing != null ? routing.getProcessName() : null;
    }

    @JsonProperty("process_time")
    public Integer getProcessTime() {
        return routing != null ? routing.getProcessTime() : null;
    }

    @JsonProperty("note")
    public String getNote() {
        return routing != null ? routing.getNote() : null;
    }
}
