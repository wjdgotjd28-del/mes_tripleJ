package com.mes_back.entity;

import com.mes_back.dto.MaterialInboundDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_inbound")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialInbound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "material_item_id", nullable = false)
    private MaterialItem materialItem;

    @Column(name = "supplier_name", nullable = false, length = 255)
    private String supplierName;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "item_code", nullable = false, length = 255)
    private String itemCode;

    @Column(name = "spec_qty", nullable = false)
    private Long specQty;

    @Column(name = "spec_unit", nullable = false, length = 5)
    private String specUnit;

    @Column(name = "manufacturer", nullable = false, length = 255)
    private String manufacturer;

    @Column(name = "manufacte_date", nullable = false)
    private LocalDate manufacteDate;

    @Column(nullable = false)
    private Long qty;

    @Column(name = "inbound_date", nullable = false)
    private LocalDate inboundDate;

    @Column(name = "inbound_no", nullable = false, length = 255)
    private String inboundNo;

    @Column(name = "total_qty", nullable = false)
    private Long totalQty;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void updateMaterialInbound(MaterialInboundDTO materialInboundDto) {
        this.specQty = materialInboundDto.getSpecQty();
        this.specUnit = materialInboundDto.getSpecUnit();
        this.qty = materialInboundDto.getQty();
        this.inboundDate = materialInboundDto.getInboundDate();
        this.manufacteDate = materialInboundDto.getManufacteDate();
    }
}

