package com.mes_back.repository;

import com.mes_back.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MasterDataOrderItemsRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT o FROM OrderItem o " +
            "LEFT JOIN FETCH o.images " +
            "LEFT JOIN FETCH o.routings r " +
            "LEFT JOIN FETCH r.routing " +
            "WHERE o.orderItemId = :id")
    Optional<OrderItem> findByIdWithImagesAndRoutings(@Param("id") Long id);

}
