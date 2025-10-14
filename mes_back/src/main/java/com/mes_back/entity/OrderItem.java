package com.mes_back.entity;
import com.mes_back.constant.OrderCategory;
import com.mes_back.constant.PaintType;
import jakarta.persistence.*;
@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "item_code", nullable = false, length = 255)
    private String itemCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderCategory category;

    @Column(length = 100)
    private String color;

    @Column(name = "unit_price", nullable = false)
    private Long unitPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "paint_type", nullable = false)
    private PaintType paintType;

    @Column(length = 255)
    private String note;

    @Column(name = "use_yn", nullable = false, length = 1)
    private String useYn;

    @Column(nullable = false, length = 1)
    private String status;
}
