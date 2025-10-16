package com.mes_back.repository;

import com.mes_back.entity.OrderItem;
import com.mes_back.entity.OrderItemImg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemImgRepository extends JpaRepository<OrderItemImg, Long> {
    List<OrderItemImg> findByOrderItem(OrderItem orderItem);
}
