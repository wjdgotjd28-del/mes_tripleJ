package com.mes_back.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
@Getter
@AllArgsConstructor
//- 모든 필드를 포함한 전체 생성자를 자동 생성

@NoArgsConstructor
//- 기본 생성자(파라미터 없는 생성자)를 자동 생성

public class RoutingDTO {
    private Long routingId;
    private String processCode;
    private String processName;
    private String processTime;
    private String note;
}


