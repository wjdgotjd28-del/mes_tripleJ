package com.mes_back.entity;

import com.mes_back.constant.MaterialCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "material_item")
@Getter
@Setter
public class MaterialItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_item_id")
    private Long materialItemId;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "item_code", nullable = false, length = 255)
    private String itemCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private MaterialCategory category;

    @Column(length = 100)
    private String color;

    @Column(name = "spec_qty", nullable = false)
    private Long specQty;

    @Column(name = "spec_unit", nullable = false, length = 5)
    private String specUnit;

    @Column(nullable = false, length = 255)
    private String manufacturer;

    @Column(length = 255)
    private String note;

    @Column(name = "use_yn", nullable = false, length = 1)
    private String useYn;
}
