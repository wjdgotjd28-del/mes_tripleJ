// 서비스 클래스가 속한 패키지
package com.mes_back.service;

// DTO와 엔티티 클래스 import
import com.mes_back.dto.MaterialStockDTO;
import com.mes_back.entity.MaterialItem;
import com.mes_back.entity.MaterialStock;

// 리포지토리 인터페이스 import
import com.mes_back.repository.MaterialItemRepository;
import com.mes_back.repository.MaterialStockRepository;

// 스프링 서비스 및 트랜잭션 어노테이션
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 컬렉션 및 스트림 관련 클래스
import java.util.List;
import java.util.stream.Collectors;

// ✅ 이 클래스는 MaterialStock 관련 비즈니스 로직을 처리하는 서비스입니다.
@Service
@Transactional
public class MaterialStockService {

    // 🔷 의존성 주입: 리포지토리 필드 선언
    private final MaterialStockRepository materialStockRepository;
    private final MaterialItemRepository materialItemRepository;

    // 🔷 생성자 주입 방식으로 리포지토리 연결
    public MaterialStockService(MaterialStockRepository materialStockRepository,
                                MaterialItemRepository materialItemRepository) {
        this.materialStockRepository = materialStockRepository;
        this.materialItemRepository = materialItemRepository;
    }

    /**
     * 🔍 전체 MaterialItem을 조회하고, 품목명 기준으로 그룹화한 뒤
     * 각 그룹에 대해 MaterialStockDTO를 생성하여 리스트로 반환합니다.
     *
     * - 품목명(itemName) 기준으로 그룹화
     * - 각 그룹의 첫 번째 항목을 기준으로 MaterialStock 조회
     * - 총 수량은 해당 그룹의 모든 specQty 합산
     */
    public List<MaterialStockDTO> findAll() {
        // 모든 MaterialItem 조회
        List<MaterialItem> items = materialItemRepository.findAll();

        // 품목명 기준으로 그룹화 후 DTO 리스트 생성
        return items.stream()
                .collect(Collectors.groupingBy(MaterialItem::getItemName)) // itemName 기준 그룹화
                .entrySet().stream()
                .map(entry -> {
                    List<MaterialItem> groupedItems = entry.getValue();     // 동일 품목명 그룹
                    MaterialItem firstItem = groupedItems.get(0);          // 대표 항목 선택

                    // 해당 품목에 연결된 MaterialStock 중 하나 조회
                    MaterialStock stock = materialStockRepository.findFirstByMaterialItem_ItemName(firstItem.getItemName());

                    // DTO 생성 및 값 설정
                    MaterialStockDTO dto = new MaterialStockDTO();
                    dto.setId(stock.getId());
                    dto.setCompanyName(firstItem.getCompany().getCompanyName()); // 거래처명
                    dto.setItemCode(firstItem.getItemCode());        // 품목 코드
                    dto.setItemName(firstItem.getItemName());        // 품목명
                    dto.setUnit(firstItem.getSpecUnit());            // 단위
                    dto.setTotalQty(                                  // 총 수량 계산
                            groupedItems.stream()
                                    .mapToInt(MaterialItem::getSpecQty)
                                    .sum()
                    );

                    return dto;
                })
                .collect(Collectors.toList()); // 최종 DTO 리스트 반환
    }

}