package com.mes_back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "orderItemRoutings")
public class Routing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "routing_id")
    private Long routingId;

    @Column(name = "process_code", nullable = false, unique = true, length = 255)
    private String processCode;

    @Column(name = "process_name", nullable = false, length = 255)
    private String processName;

    @Column(name = "process_time", nullable = false)
    private Integer processTime;

    @Column(length = 255)
    private String note;

    // OrderItemRouting과 1:N 관계 매핑
    @OneToMany(mappedBy = "routing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemRouting> orderItemRoutings = new ArrayList<>();

}


