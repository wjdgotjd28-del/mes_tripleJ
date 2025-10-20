package com.mes_back.service;

import com.mes_back.dto.ProcessTrackingDTO;
import com.mes_back.entity.OrderInbound;
import com.mes_back.entity.OrderItemRouting;
import com.mes_back.entity.ProcessTracking;
import com.mes_back.repository.OrderInboundRepository;
import com.mes_back.repository.OrderItemRoutingRepository;
import com.mes_back.repository.ProcessTrackingRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderInboundProcessTrackingService {

    private final ProcessTrackingRepository processTrackingRepository;
    private final OrderInboundRepository orderInboundRepository;
    private final OrderItemRoutingRepository orderItemRoutingRepository;
    private final ModelMapper modelMapper;

    // 공정 진행 현황 조회
    public List<ProcessTrackingDTO> getProcessTracking(Long id) {
        return processTrackingRepository.findProcessTrackingWithOrderItem(id)
                .stream()
                .map(entity -> {
                    ProcessTrackingDTO dto = new ProcessTrackingDTO();
                    dto.setId(entity.getId());
                    dto.setOrderInboundId(entity.getOrderInbound().getOrderInboundId());

                    if(entity.getOrderItemRouting() != null) {
                        dto.setOrderItemRoutingId(entity.getOrderItemRouting().getId());

                        if(entity.getOrderItemRouting().getOrderItem() != null) {
                            dto.setOrderItemId(entity.getOrderItemRouting().getOrderItemId());
                        }

                        if(entity.getOrderItemRouting().getRouting() != null) {
                            dto.setProcessName(entity.getOrderItemRouting().getRouting().getProcessName());
                            dto.setProcessTime(entity.getOrderItemRouting().getRouting().getProcessTime());
                            dto.setProcessNo(entity.getOrderItemRouting().getProcessNo().intValue());
                        }
                    }

                    dto.setProcessStartTime(entity.getProcessStartTime());
                    dto.setProcessStatus(entity.getProcessStatus());
                    return dto;
                }).collect(Collectors.toList());
    }

    // ⭐ 공정 진행 현황 등록 (초기화) - 단일 order_inbound_id 처리
    @Transactional
    public List<ProcessTrackingDTO> createProcessTrackingBatch(ProcessTrackingDTO dto) {
        // 1️⃣ OrderInbound 조회
        OrderInbound orderInbound = orderInboundRepository.findById(dto.getOrderInboundId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid order inbound ID: " + dto.getOrderInboundId()));

        // 2️⃣ 해당 OrderInbound의 모든 OrderItemRouting 조회
        List<OrderItemRouting> routings = orderItemRoutingRepository.findAllByOrderInboundId(dto.getOrderInboundId());

        if (routings.isEmpty()) {
            throw new IllegalArgumentException("No OrderItemRouting found for inbound ID: " + dto.getOrderInboundId());
        }

        // 3️⃣ ProcessTracking 엔티티 생성
        List<ProcessTracking> entities = routings.stream()
                .map(routing -> {
                    ProcessTracking pt = new ProcessTracking();
                    pt.setOrderInbound(orderInbound);
                    pt.setOrderItemRouting(routing);
                    pt.setProcessStatus(dto.getProcessStatus() != null ? dto.getProcessStatus() : 0);
                    pt.setProcessStartTime(dto.getProcessStartTime());
                    return pt;
                })
                .collect(Collectors.toList());

        // 4️⃣ 저장
        List<ProcessTracking> saved = processTrackingRepository.saveAll(entities);

        // 5️⃣ DTO 변환 후 반환
        return saved.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ⭐ 공정 진행 현황 일괄 등록 (배열 처리용 - 새로 추가)
    @Transactional
    public List<ProcessTrackingDTO> createProcessTrackingBatchList(List<ProcessTrackingDTO> dtoList) {
        if (dtoList == null || dtoList.isEmpty()) {
            throw new IllegalArgumentException("DTO list cannot be empty");
        }

        // 중복 제거: 같은 order_inbound_id는 한 번만 처리
        List<Long> uniqueOrderInboundIds = dtoList.stream()
                .map(ProcessTrackingDTO::getOrderInboundId)
                .distinct()
                .collect(Collectors.toList());

        List<ProcessTrackingDTO> allResults = uniqueOrderInboundIds.stream()
                .flatMap(orderInboundId -> {
                    ProcessTrackingDTO dto = new ProcessTrackingDTO();
                    dto.setOrderInboundId(orderInboundId);
                    dto.setProcessStatus(0); // 기본값
                    dto.setProcessStartTime(null);
                    return createProcessTrackingBatch(dto).stream();
                })
                .collect(Collectors.toList());

        return allResults;
    }

    // 공정 진행 현황 업데이트
    @Transactional
    public ProcessTrackingDTO updateProcessTracking(ProcessTrackingDTO dto) {
        if (dto.getId() == null) {
            throw new IllegalArgumentException("ProcessTracking ID cannot be null");
        }

        ProcessTracking entity = processTrackingRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid process tracking ID: " + dto.getId()));

        LocalDateTime now = LocalDateTime.now();

        // 상태가 null이면 0으로 초기화
        Integer newStatus = dto.getProcessStatus() != null ? dto.getProcessStatus() : 0;

        // 1️⃣ 프론트 상태값 반영
        if (!newStatus.equals(entity.getProcessStatus())) {
            entity.setProcessStatus(newStatus);
            if (newStatus == 0) {
                entity.setProcessStartTime(null);
            }
        }

        // 2️⃣ 진행중 상태인데 시작시간 없으면 현재시간 입력
        if (entity.getProcessStatus() == 1 && entity.getProcessStartTime() == null) {
            entity.setProcessStartTime(now);

            List<ProcessTracking> allProcesses = processTrackingRepository.findProcessTrackingWithOrderItem(
                    entity.getOrderInbound().getOrderInboundId()
            );

            Long currentProcessNo = entity.getOrderItemRouting().getProcessNo();
            allProcesses.stream()
                    .filter(p -> p.getOrderItemRouting().getProcessNo() < currentProcessNo)
                    .filter(p -> p.getProcessStatus() != 2)
                    .forEach(p -> p.setProcessStatus(2));

            processTrackingRepository.saveAll(allProcesses);
        }

        processTrackingRepository.save(entity);

        return convertToDTO(entity);
    }

    // ⭐ 공정 진행현황 일괄 업데이트
    @Transactional
    public List<ProcessTrackingDTO> updateProcessTrackingBatch(List<ProcessTrackingDTO> dtoList) {
        if (dtoList == null || dtoList.isEmpty()) {
            throw new IllegalArgumentException("DTO list cannot be empty");
        }

        List<ProcessTrackingDTO> updatedList = dtoList.stream()
                .map(this::updateProcessTracking) // 기존 단일 업데이트 로직 재사용
                .collect(Collectors.toList());

        return updatedList;
    }

    // DTO 변환 헬퍼 메서드
    private ProcessTrackingDTO convertToDTO(ProcessTracking entity) {
        ProcessTrackingDTO dto = new ProcessTrackingDTO();
        dto.setId(entity.getId());
        dto.setOrderInboundId(entity.getOrderInbound().getOrderInboundId());

        if (entity.getOrderItemRouting() != null) {
            dto.setOrderItemRoutingId(entity.getOrderItemRouting().getId());
            dto.setOrderItemId(entity.getOrderItemRouting().getOrderItemId());

            if (entity.getOrderItemRouting().getRouting() != null) {
                dto.setProcessName(entity.getOrderItemRouting().getRouting().getProcessName());
                dto.setProcessTime(entity.getOrderItemRouting().getRouting().getProcessTime());
                dto.setProcessNo(entity.getOrderItemRouting().getProcessNo().intValue());
            }
        }

        dto.setProcessStartTime(entity.getProcessStartTime());
        dto.setProcessStatus(entity.getProcessStatus());

        return dto;
    }
}