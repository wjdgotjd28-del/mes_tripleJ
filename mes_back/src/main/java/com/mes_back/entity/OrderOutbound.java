package com.mes_back.entity;

import com.mes_back.constant.OrderCategory;
import jakarta.persistence.*;
        import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity @Table(name = "order_outbound")
@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderOutbound {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ (수정) fetch = FetchType.LAZY 추가
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_inbound_id", nullable = false)
    private OrderInbound orderInbound;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "item_code", nullable = false, length = 255)
    private String itemCode;

    @Column(nullable = false)
    private Long qty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderCategory category;

    @Column(name = "outbound_no", nullable = false, length = 20)
    private String outboundNo;

    @Column(name = "outbound_date", nullable = false)
    private LocalDate outboundDate;



//    //테스트용
//    package com.mes_back.entity;
//
//import com.mes_back.constant.OrderCategory;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import java.time.LocalDate;
//
//    @Entity
//    @Table(name = "order_outbound")
//    @Getter
//    @NoArgsConstructor
//    @AllArgsConstructor
//    @Builder
//    public class OrderOutbound {
//
//        @Id
//        @GeneratedValue(strategy = GenerationType.IDENTITY)
//        private Long id;
//
//        // ✅ (수정) fetch = FetchType.LAZY 추가
//        @ManyToOne(fetch = FetchType.LAZY)
//        @JoinColumn(name = "order_inbound_id", nullable = false)
//        private OrderInbound orderInbound;
//
//        @Column(name = "customer_name", nullable = false, length = 255)
//        private String customerName;
//
//        // ⚠️ 테스트용: nullable = true 로 변경
//        @Column(name = "item_name", nullable = true, length = 255)
//        private String itemName;
//
//        @Column(name = "item_code", nullable = false, length = 255)
//        private String itemCode;
//
//        @Column(nullable = false)
//        private Long qty;
//
//        @Enumerated(EnumType.STRING)
//        @Column(nullable = false)
//        private OrderCategory category;
//
//        @Column(name = "outbound_no", nullable = false, length = 20)
//        private String outboundNo;
//
//        @Column(name = "outbound_date", nullable = false)
//        private LocalDate outboundDate;
//     }
    }


