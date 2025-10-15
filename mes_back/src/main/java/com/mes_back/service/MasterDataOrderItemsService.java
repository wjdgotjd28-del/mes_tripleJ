package com.mes_back.service;

import com.mes_back.dto.OrderItemDTO;
import com.mes_back.dto.OrderItemImgDTO;
import com.mes_back.dto.OrderItemRequestDTO;
import com.mes_back.dto.OrderItemRoutingDTO;
import com.mes_back.entity.*;
import com.mes_back.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class MasterDataOrderItemsService {

    private final MasterDataOrderItemsRepository masterDataOrderItemsRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;
    private final RoutingRepository routingRepository;
    private final OrderItemRoutingRepository orderItemRoutingRepository;
    private final OrderItemImgRepository orderItemImgRepository;

    // 전체 조회
    public List<OrderItemRequestDTO> getOrderItem() {
        return masterDataOrderItemsRepository.findAll()
                .stream()
                .map(this::convertToRequestDTO)
                .collect(Collectors.toList());
    }

    // 상세 조회
    public OrderItemRequestDTO getOrderItemById(Long id) {
        OrderItem item = masterDataOrderItemsRepository.findByIdWithImagesAndRoutings(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        OrderItemRequestDTO dto = convertToRequestDTO(item);

        // 이미지
        dto.setImage(item.getImages().stream()
                .map(img -> modelMapper.map(img, OrderItemImgDTO.class))
                .toList());

        // 라우팅
        dto.setRouting(item.getRoutings().stream()
                .map(r -> {
                    OrderItemRoutingDTO rDto = modelMapper.map(r, OrderItemRoutingDTO.class);
                    rDto.setRoutingId(r.getRouting().getRoutingId());
                    rDto.setStep(r.getStep());
                    rDto.setDescription(r.getDescription());
                    rDto.setDuration(r.getDuration());
                    return rDto;
                })
                .toList());

        return dto;
    }

    // 등록
    public OrderItemDTO createOrderItem(OrderItemRequestDTO requestDTO) {
        // 1. 회사 조회
        Company company = companyRepository.findByCompanyName(requestDTO.getCompanyName())
                .orElseThrow(() -> new RuntimeException("해당 업체를 찾을 수 없습니다: " + requestDTO.getCompanyName()));

        // 2. OrderItem 엔티티 생성 및 저장
        OrderItem orderItem = modelMapper.map(requestDTO, OrderItem.class);
        orderItem.setCompany(company);
        OrderItem savedItem = masterDataOrderItemsRepository.save(orderItem);

        // 3. 라우팅 저장
        if (requestDTO.getRouting() != null) {
            for (OrderItemRoutingDTO routingDTO : requestDTO.getRouting()) {
                Routing routingEntity = routingRepository.findById(routingDTO.getRoutingId())
                        .orElseThrow(() -> new RuntimeException("라우팅을 찾을 수 없습니다: " + routingDTO.getRoutingId()));

                OrderItemRouting itemRouting = new OrderItemRouting();
                itemRouting.setOrderItem(savedItem);
                itemRouting.setRouting(routingEntity);
                itemRouting.setProcessNo(routingDTO.getProcessNo());
                orderItemRoutingRepository.save(itemRouting);
            }
        }

        // 4. 이미지 저장
        if (requestDTO.getImage() != null) {
            for (OrderItemImgDTO imgDTO : requestDTO.getImage()) {
                OrderItemImg imgEntity = new OrderItemImg();
                imgEntity.setOrderItem(savedItem);
                imgEntity.setImgUrl(imgDTO.getImgUrl());
                imgEntity.setImgOriName(imgDTO.getImgOriName());
                imgEntity.setImgName(imgDTO.getImgName());
                orderItemImgRepository.save(imgEntity);
            }
        }

        // 5. DTO 반환
        OrderItemDTO dto = modelMapper.map(savedItem, OrderItemDTO.class);
        dto.setCompanyId(company.getCompanyId());
        return dto;
    }

    // 수정
    public OrderItemDTO updateOrderItem(Long id, OrderItemRequestDTO requestDTO) {
        OrderItem updatedItem = masterDataOrderItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        // 회사 매핑
        Company company = companyRepository.findByCompanyName(requestDTO.getCompanyName())
                .orElseThrow(() -> new RuntimeException("해당 업체를 찾을 수 없습니다: " + requestDTO.getCompanyName()));
        updatedItem.setCompany(company);

        // 나머지 필드 매핑
        modelMapper.map(requestDTO, updatedItem);

        OrderItem saved = masterDataOrderItemsRepository.save(updatedItem);
        OrderItemDTO dto = modelMapper.map(saved, OrderItemDTO.class);
        dto.setCompanyId(company.getCompanyId());
        return dto;
    }

    // soft delete
    public void deleteOrderItem(Long id) {
        masterDataOrderItemsRepository.findById(id).ifPresent(item -> {
            item.setUseYn("N");
            masterDataOrderItemsRepository.save(item);
        });
    }

    // 복원
    public OrderItemDTO restoreOrderItem(Long id) {
        OrderItem item = masterDataOrderItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        item.setUseYn("Y".equalsIgnoreCase(item.getUseYn()) ? "N" : "Y");
        OrderItem saved = masterDataOrderItemsRepository.save(item);

        OrderItemDTO dto = modelMapper.map(saved, OrderItemDTO.class);
        dto.setCompanyId(saved.getCompany().getCompanyId());
        return dto;
    }

    // Entity → RequestDTO 변환 (프론트용)
    private OrderItemRequestDTO convertToRequestDTO(OrderItem item) {
        OrderItemRequestDTO dto = modelMapper.map(item, OrderItemRequestDTO.class);
        dto.setCompanyName(item.getCompany().getCompanyName());
        return dto;
    }

}
