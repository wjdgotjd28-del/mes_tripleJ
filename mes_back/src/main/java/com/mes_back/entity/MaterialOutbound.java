package com.mes_back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "material_outbound")
@Getter
@Setter
public class MaterialOutbound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "material_inbound_id", nullable = false)
    private MaterialInbound materialInbound;

    @Column(name = "spec_qty", nullable = false)
    private Long specQty;

    @Column(nullable = false, length = 255)
    private String manufacturer;

    @Column(nullable = false)
    private Long qty;

    @Column(name = "outbound_date", nullable = false)
    private LocalDateTime outboundDate;

    @Column(name = "outbound_no", nullable = false, length = 255)
    private String outboundNo;
}