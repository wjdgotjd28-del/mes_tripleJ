package com.mes_back.repository;

import com.mes_back.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MasterDataOrderItemsRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT o FROM OrderItem o " +
            "LEFT JOIN FETCH o.images " +
            "LEFT JOIN FETCH o.routings r " +
            "LEFT JOIN FETCH r.routing " +
            "WHERE o.orderItemId = :id")
    Optional<OrderItem> findByIdWithImagesAndRoutings(@Param("id") Long id);

    @Query("SELECT DISTINCT o FROM OrderItem o " +
            "LEFT JOIN FETCH o.images " +
            "WHERE o.orderItemId = :id")
    Optional<OrderItem> findByIdWithImages(@Param("id") Long id);

    @Query("SELECT DISTINCT o FROM OrderItem o " +
            "LEFT JOIN FETCH o.routings " +
            "WHERE o.orderItemId = :id")
    Optional<OrderItem> findByIdWithRoutings(@Param("id") Long id);

    // Company status로 OrderItem 조회
    @Query("SELECT oi FROM OrderItem oi WHERE oi.company.status = :status")
    List<OrderItem> findByCompanyStatus(@Param("status") String status);

    // 거래중인 업체의 OrderItem만 조회
    @Query("SELECT oi FROM OrderItem oi WHERE oi.company.status = 'Y' AND oi.company.deletedAt IS NULL")
    List<OrderItem> findAllActive();
}
