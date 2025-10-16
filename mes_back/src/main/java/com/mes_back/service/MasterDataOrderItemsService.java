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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
@Transactional
public class MasterDataOrderItemsService {

    private final MasterDataOrderItemsRepository masterDataOrderItemsRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;
    private final RoutingRepository routingRepository;
    private final OrderItemRoutingRepository orderItemRoutingRepository;
    private final OrderItemImgRepository orderItemImgRepository;
    private final jakarta.persistence.EntityManager entityManager;

    @Value("${file.imgFileLocation}")
    private String imgFileLocation;

    /* =========================================
       조회
     ========================================= */
    public List<OrderItemRequestDTO> getOrderItem() {
        List<OrderItem> items = masterDataOrderItemsRepository.findAll();
        return items.stream()
                .map(this::convertToRequestDTO)
                .collect(Collectors.toList());
    }

    public OrderItemRequestDTO getOrderItemById(Long id) {
        OrderItem item = masterDataOrderItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        OrderItemRequestDTO dto = convertToRequestDTO(item);

        // 라우팅 조회
        List<OrderItemRoutingDTO> routings = orderItemRoutingRepository.findByOrderItem(item).stream()
                .map(r -> {
                    OrderItemRoutingDTO routingDto = modelMapper.map(r, OrderItemRoutingDTO.class);
                    routingDto.setRoutingId(r.getRouting().getRoutingId());
                    routingDto.setProcessNo(r.getProcessNo());

                    Routing master = r.getRouting();
                    routingDto.setProcessCode(master.getProcessCode());
                    routingDto.setProcessName(master.getProcessName());
                    routingDto.setProcessTime(master.getProcessTime());
                    routingDto.setNote(master.getNote());
                    return routingDto;
                })
                .collect(Collectors.toList());
        dto.setRouting(routings);

        return dto;
    }

    /* =========================================
       생성
     ========================================= */
    public OrderItemDTO createOrderItemWithFiles(OrderItemRequestDTO requestDTO,
                                                 List<OrderItemRoutingDTO> routingList,
                                                 List<MultipartFile> images) throws IOException {
        Company company = companyRepository.findByCompanyName(requestDTO.getCompanyName())
                .orElseThrow(() -> new RuntimeException("해당 업체를 찾을 수 없습니다: " + requestDTO.getCompanyName()));

        OrderItem orderItem = modelMapper.map(requestDTO, OrderItem.class);
        orderItem.setCompany(company);
        OrderItem savedItem = masterDataOrderItemsRepository.save(orderItem);

        if (routingList != null && !routingList.isEmpty()) {
            syncRouting(savedItem, routingList);
        }

        // 신규 등록 시 keepImageIds=null
        syncImages(savedItem, images, null);

        entityManager.flush();
        entityManager.clear();

        OrderItem refreshedItem = masterDataOrderItemsRepository.findById(savedItem.getOrderItemId())
                .orElseThrow(() -> new EntityNotFoundException("Item not found after save"));
        OrderItemDTO dto = modelMapper.map(refreshedItem, OrderItemDTO.class);
        dto.setCompanyId(company.getCompanyId());
        return dto;
    }

    /* =========================================
       수정
     ========================================= */
    public OrderItemDTO updateOrderItemWithFiles(Long id,
                                                 OrderItemRequestDTO requestDTO,
                                                 List<OrderItemRoutingDTO> routingList,
                                                 List<MultipartFile> newImages) throws IOException {
        OrderItem orderItem = masterDataOrderItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        Company company = companyRepository.findByCompanyName(requestDTO.getCompanyName())
                .orElseThrow(() -> new RuntimeException("해당 업체를 찾을 수 없습니다: " + requestDTO.getCompanyName()));
        orderItem.setCompany(company);

        orderItem.setItemName(requestDTO.getItemName());
        orderItem.setItemCode(requestDTO.getItemCode());
        orderItem.setCategory(requestDTO.getCategory());
        orderItem.setColor(requestDTO.getColor());
        orderItem.setUnitPrice(requestDTO.getUnitPrice());
        orderItem.setPaintType(requestDTO.getPaintType());
        orderItem.setNote(requestDTO.getNote());
        orderItem.setUseYn(requestDTO.getUseYn());
        orderItem.setStatus(requestDTO.getStatus());

        syncRouting(orderItem, routingList);

        // === 수정: 기존 이미지 ID 포함 여부 체크 ===
        List<Long> keepImageIds = (requestDTO.getImage() != null)
                ? requestDTO.getImage().stream()
                .map(OrderItemImgDTO::getOrderItemImgId)
                .filter(Objects::nonNull)
                .toList()
                : List.of(); // null이면 빈 리스트로 처리하여 기존 이미지 삭제 방지

        syncImages(orderItem, newImages, keepImageIds);

        entityManager.flush();
        entityManager.clear();

        OrderItem saved = masterDataOrderItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found after update"));
        OrderItemDTO dto = modelMapper.map(saved, OrderItemDTO.class);
        dto.setCompanyId(saved.getCompany().getCompanyId());
        return dto;
    }

    /* =========================================
       이미지 동기화
     ========================================= */
    private void syncImages(OrderItem orderItem, List<MultipartFile> newImages, List<Long> keepImageIds) throws IOException {
        List<OrderItemImg> existingImages = orderItemImgRepository.findByOrderItem(orderItem);

        // 삭제할 이미지 선정 (keepImageIds에 없는 것)
        List<OrderItemImg> imagesToDelete = (keepImageIds.isEmpty())
                ? List.of() // 빈 리스트면 삭제 안 함
                : existingImages.stream()
                .filter(img -> !keepImageIds.contains(img.getOrderItemImgId()))
                .toList();

        // 실제 DB와 파일에서 삭제
        for (OrderItemImg img : imagesToDelete) {
            deleteOrderItemImage(img);
        }

        if (orderItem.getImages() != null) {
            orderItem.getImages().removeIf(imagesToDelete::contains);
        } else {
            orderItem.setImages(new java.util.ArrayList<>());
        }

        // 새 이미지 추가 로직 그대로
        if (newImages != null && !newImages.isEmpty()) {
            String uploadDir = imgFileLocation + "/order_items/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            for (MultipartFile file : newImages) {
                if (file.isEmpty()) continue;

                String timestamp = String.valueOf(System.currentTimeMillis());
                String randomStr = UUID.randomUUID().toString().substring(0, 8);
                String originalFileName = file.getOriginalFilename();
                String ext = originalFileName != null && originalFileName.contains(".")
                        ? originalFileName.substring(originalFileName.lastIndexOf("."))
                        : "";
                String savedFileName = timestamp + "_" + randomStr + ext;

                Path filePath = uploadPath.resolve(savedFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                OrderItemImg imgEntity = new OrderItemImg();
                imgEntity.setOrderItem(orderItem);
                imgEntity.setImgOriName(originalFileName);
                imgEntity.setImgName(savedFileName);
                imgEntity.setImgUrl("http://localhost:8080/uploads/order_items/" + savedFileName);

                OrderItemImg savedImg = orderItemImgRepository.save(imgEntity);
                orderItem.getImages().add(savedImg);

                log.info("새 이미지 추가: ID={}, 파일명={}", savedImg.getOrderItemImgId(), savedFileName);
            }
        }

        log.info("이미지 동기화 완료: 유지된 이미지 수={}, 새 이미지 수={}",
                existingImages.size() - imagesToDelete.size(),
                newImages != null ? newImages.size() : 0);
    }

    /* 개별 이미지 삭제 */
    public void deleteSingleImage(Long imageId) {
        OrderItemImg img = orderItemImgRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found: " + imageId));

        // 1. OrderItem 컬렉션에서 제거
        OrderItem orderItem = img.getOrderItem();
        if (orderItem.getImages() != null) {
            orderItem.getImages().remove(img);
        }

        // 2. DB + 파일 삭제
        deleteOrderItemImage(img);
    }

    /* 이미지 삭제 수정 */
    private void deleteOrderItemImage(OrderItemImg img) {
        try {
            deleteFile(img.getImgName()); // img_url 대신 img_name 기준
            orderItemImgRepository.delete(img);
            log.info("이미지 삭제 완료: ID={}, 파일명={}", img.getOrderItemImgId(), img.getImgName());
        } catch (Exception e) {
            log.error("이미지 삭제 실패: ID={}, 파일명={}", img.getOrderItemImgId(), img.getImgName(), e);
        }
    }

    /* deleteFile 수정 */
    private void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(imgFileLocation, "order_items", fileName);
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) log.info("파일 삭제 성공: {}", fileName);
            else log.warn("파일이 존재하지 않음: {}", fileName);
        } catch (Exception e) {
            log.error("파일 삭제 실패: " + fileName, e);
        }
    }

    /* =========================================
       라우팅 동기화
     ========================================= */
    private void syncRouting(OrderItem orderItem, List<OrderItemRoutingDTO> newRoutingList) {
        List<OrderItemRouting> existing = orderItemRoutingRepository.findByOrderItem(orderItem);

        // 삭제
        existing.stream()
                .filter(er -> newRoutingList == null || newRoutingList.stream()
                        .noneMatch(nr -> nr.getRoutingId().equals(er.getRouting().getRoutingId())))
                .forEach(orderItemRoutingRepository::delete);

        // 추가/수정
        if (newRoutingList != null) {
            for (OrderItemRoutingDTO dto : newRoutingList) {
                OrderItemRouting matched = existing.stream()
                        .filter(er -> er.getRouting().getRoutingId().equals(dto.getRoutingId()))
                        .findFirst()
                        .orElse(null);

                if (matched != null) {
                    matched.setProcessNo(dto.getProcessNo());
                    orderItemRoutingRepository.save(matched);
                } else {
                    Routing routingEntity = routingRepository.findById(dto.getRoutingId())
                            .orElseThrow(() -> new RuntimeException("라우팅을 찾을 수 없습니다: " + dto.getRoutingId()));
                    OrderItemRouting newRouting = modelMapper.map(dto, OrderItemRouting.class);
                    newRouting.setOrderItem(orderItem);
                    newRouting.setRouting(routingEntity);
                    newRouting.setProcessNo(dto.getProcessNo());
                    orderItem.addRouting(newRouting);
                    orderItemRoutingRepository.save(newRouting);
                }
            }
        }
    }

    /* =========================================
       주문 품목 삭제
     ========================================= */
    public void deleteOrderItem(Long id) {
        OrderItem item = masterDataOrderItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        // 이미지 삭제
        List<OrderItemImg> images = orderItemImgRepository.findByOrderItem(item);
        for (OrderItemImg img : images) deleteOrderItemImage(img);
        orderItemImgRepository.flush();

        // 라우팅 삭제
        List<OrderItemRouting> routings = orderItemRoutingRepository.findByOrderItem(item);
        orderItemRoutingRepository.deleteAll(routings);

        // 최종 OrderItem 삭제
        masterDataOrderItemsRepository.delete(item);
        masterDataOrderItemsRepository.flush();

        log.info("주문 품목 삭제 완료: ID={}", id);
    }

    /* =========================================
       복원
     ========================================= */
    public OrderItemDTO restoreOrderItem(Long id) {
        OrderItem item = masterDataOrderItemsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + id));

        item.setUseYn("Y".equalsIgnoreCase(item.getUseYn()) ? "N" : "Y");
        OrderItem saved = masterDataOrderItemsRepository.save(item);

        OrderItemDTO dto = modelMapper.map(saved, OrderItemDTO.class);
        dto.setCompanyId(saved.getCompany().getCompanyId());
        return dto;
    }

    /* =========================================
       Entity → RequestDTO 변환
     ========================================= */
    private OrderItemRequestDTO convertToRequestDTO(OrderItem item) {
        OrderItemRequestDTO dto = modelMapper.map(item, OrderItemRequestDTO.class);

        List<OrderItemImgDTO> images = orderItemImgRepository.findByOrderItem(item).stream()
                .map(img -> {
                    OrderItemImgDTO dtoImg = modelMapper.map(img, OrderItemImgDTO.class);
                    dtoImg.setOrderItemId(img.getOrderItem() != null ? img.getOrderItem().getOrderItemId() : null);
                    return dtoImg;
                })
                .collect(Collectors.toList());
        dto.setImage(images);
        dto.setCompanyName(item.getCompany().getCompanyName());
        return dto;
    }
}
