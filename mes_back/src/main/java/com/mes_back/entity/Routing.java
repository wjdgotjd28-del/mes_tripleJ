package com.mes_back.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "routing")
public class Routing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "routing_id")
    private Long routingId;

    @Column(name = "pocess_code", nullable = false, unique = true, length = 255)
    private String pocessCode;

    @Column(name = "pocess_name", nullable = false, length = 255)
    private String pocessName;

    @Column(name = "process_time", nullable = false)
    private LocalDate processTime;

    @Column(length = 255)
    private String note;
}
