package com.mes_back.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "material_outbound")
public class MaterialOutbound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "material_item_id", nullable = false)
    private MaterialItem materialItem;

    @Column(name = "spec_qty", nullable = false)
    private Long specQty;

    @Column(nullable = false, length = 255)
    private String manufacturer;

    @Column(nullable = false)
    private Long qty;

    @Column(name = "inbound_date", nullable = false)
    private LocalDate inboundDate;
}