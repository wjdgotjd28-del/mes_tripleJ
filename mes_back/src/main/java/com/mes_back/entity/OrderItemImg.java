package com.mes_back.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_item_img")
public class OrderItemImg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_img_id")
    private Long orderItemImgId;

    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(name = "img_url", nullable = false, length = 255)
    private String imgUrl;

    @Column(name = "img_ori_name", nullable = false, length = 255)
    private String imgOriName;

    @Column(name = "img_name", nullable = false, length = 255)
    private String imgName;
}
