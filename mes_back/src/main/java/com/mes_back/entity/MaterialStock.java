package com.mes_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "material_stock")
public class MaterialStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "material_item_id", nullable = false)
    private MaterialItem materialItem;

    @Column(name = "total_qty", nullable = false)
    private Long totalQty;

    @Column(nullable = false, length = 5)
    private String unit;
}