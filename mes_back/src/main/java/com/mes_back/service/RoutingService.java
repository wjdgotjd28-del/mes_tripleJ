package com.mes_back.service;

import com.mes_back.dto.RoutingDTO;
import com.mes_back.entity.Routing;
import com.mes_back.repository.RoutingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RoutingService {

    // Routing 엔티티에 대한 데이터 접근을 위한 Repository 의존성 주입
    private final RoutingRepository routingRepository;

    /**
     * 새로운 공정 정보를 저장합니다.
     * 동일한 공정 코드가 이미 존재하는 경우 예외를 발생시킵니다.
     *
     * @param dto 저장할 공정 정보 DTO
     * @return 저장된 Routing 엔티티
     */
    public Routing save(RoutingDTO dto) {
        // 중복 공정 코드 체크
        if (routingRepository.existsByProcessCode(dto.getProcessCode())) {
            throw new IllegalArgumentException("이미 존재하는 공정 코드입니다.");
        }

        // DTO를 엔티티로 변환
        Routing routing = new Routing();
        routing.setProcessCode(dto.getProcessCode());
        routing.setProcessName(dto.getProcessName());
        routing.setProcessTime(dto.getProcessTime());
        routing.setNote(dto.getNote());

        // DB에 저장 후 결과 반환
        return routingRepository.save(routing);
    }

    /**
     * 모든 공정 정보를 조회합니다.
     * 전체 공정 목록을 화면에 보여주기 위해
     * @return Routing 엔티티 리스트
     */
    public List<RoutingDTO> findAll() {
        return routingRepository.findAll().stream()
                .map(r -> new RoutingDTO(
                        r.getRoutingId(),
                        r.getProcessCode(),
                        r.getProcessName(),
                        r.getProcessTime(),
                        r.getNote()
                ))
                .toList();
    }

    @Transactional
    public void DeleteById(Long id) {
        Routing routing = routingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공정입니다."));
        routingRepository.delete(routing); // Cascade 덕분에 연결된 OrderItemRouting도 자동 삭제
    }
}
