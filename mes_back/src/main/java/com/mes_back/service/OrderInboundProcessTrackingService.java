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
                        }
                    }

                    dto.setProcessStartTime(entity.getProcessStartTime());
                    dto.setProcessStatus(entity.getProcessStatus());
                    return dto;
                }).collect(Collectors.toList());
    }

    // ⭐ 공정 진행 현황 등록 (초기화) - 새로 추가
    @Transactional
    public ProcessTrackingDTO createProcessTracking(ProcessTrackingDTO dto) {
        // OrderInbound 조회
        OrderInbound orderInbound = orderInboundRepository.findById(dto.getOrderInboundId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid order inbound ID: " + dto.getOrderInboundId()));

        // OrderItemRouting 조회
        OrderItemRouting orderItemRouting = orderItemRoutingRepository.findById(dto.getOrderItemRoutingId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid order item routing ID: " + dto.getOrderItemRoutingId()));

        // ProcessTracking 엔티티 생성
        ProcessTracking entity = new ProcessTracking();
        entity.setOrderInbound(orderInbound);
        entity.setOrderItemRouting(orderItemRouting);
        entity.setProcessStatus(dto.getProcessStatus() != null ? dto.getProcessStatus() : 0); // 기본값: 대기
        entity.setProcessStartTime(dto.getProcessStartTime());

        // 저장
        ProcessTracking saved = processTrackingRepository.save(entity);

        // DTO 변환 후 반환
        ProcessTrackingDTO resultDto = new ProcessTrackingDTO();
        resultDto.setId(saved.getId());
        resultDto.setOrderInboundId(saved.getOrderInbound().getOrderInboundId());

        if (saved.getOrderItemRouting() != null) {
            resultDto.setOrderItemRoutingId(saved.getOrderItemRouting().getId());

            if (saved.getOrderItemRouting().getOrderItem() != null) {
                resultDto.setOrderItemId(saved.getOrderItemRouting().getOrderItemId());
            }

            if (saved.getOrderItemRouting().getRouting() != null) {
                resultDto.setProcessName(saved.getOrderItemRouting().getRouting().getProcessName());
                resultDto.setProcessTime(saved.getOrderItemRouting().getRouting().getProcessTime());
            }
        }

        resultDto.setProcessStartTime(saved.getProcessStartTime());
        resultDto.setProcessStatus(saved.getProcessStatus());

        return resultDto;
    }

    // 공정 진행 현황 업데이트
    @Transactional
    public ProcessTrackingDTO updateProcessTracking(ProcessTrackingDTO dto) {
        ProcessTracking entity = processTrackingRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid process tracking ID"));

        LocalDateTime now = LocalDateTime.now();

        // 1️⃣ 프론트 상태값 반영
        if (!dto.getProcessStatus().equals(entity.getProcessStatus())) {
            entity.setProcessStatus(dto.getProcessStatus());
        }

        // 2️⃣ 진행중 상태인데 시작시간 없으면 현재시간 입력
        if (entity.getProcessStatus() == 1 && entity.getProcessStartTime() == null) {
            entity.setProcessStartTime(now);

            // 이전 공정 완료 처리
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

        // 3️⃣ 공정시간 경과 시 자동 완료
        if (entity.getOrderItemRouting() != null && entity.getOrderItemRouting().getRouting() != null
                && entity.getProcessStartTime() != null) {
            int processMinutes = entity.getOrderItemRouting().getRouting().getProcessTime();
            LocalDateTime expectedEnd = entity.getProcessStartTime().plusMinutes(processMinutes);

            if (now.isAfter(expectedEnd)) {
                entity.setProcessStatus(2);
            }
        }

        processTrackingRepository.save(entity);

        // 4️⃣ 수동 매핑으로 DTO 생성
        ProcessTrackingDTO resultDto = new ProcessTrackingDTO();
        resultDto.setId(entity.getId());
        resultDto.setOrderInboundId(entity.getOrderInbound().getOrderInboundId());
        if (entity.getOrderItemRouting() != null) {
            resultDto.setOrderItemRoutingId(entity.getOrderItemRouting().getId());
            if (entity.getOrderItemRouting().getOrderItem() != null) {
                resultDto.setOrderItemId(entity.getOrderItemRouting().getOrderItemId());
            }
            if (entity.getOrderItemRouting().getRouting() != null) {
                resultDto.setProcessName(entity.getOrderItemRouting().getRouting().getProcessName());
                resultDto.setProcessTime(entity.getOrderItemRouting().getRouting().getProcessTime());
            }
        }
        resultDto.setProcessStartTime(entity.getProcessStartTime());
        resultDto.setProcessStatus(entity.getProcessStatus());

        return resultDto;
    }
}
