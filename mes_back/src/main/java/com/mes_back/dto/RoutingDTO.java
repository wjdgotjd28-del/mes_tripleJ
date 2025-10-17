package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
@Getter
@AllArgsConstructor
//- 모든 필드를 포함한 전체 생성자를 자동 생성
@Builder
@NoArgsConstructor
//- 기본 생성자(파라미터 없는 생성자)를 자동 생성

public class RoutingDTO {
    @JsonProperty("routing_id")
    private Long routingId;
    @JsonProperty("process_code")
    private String processCode;
    @JsonProperty("process_name")
    private String processName;
    @JsonProperty("process_time")
    private Integer processTime;
    private String note;
}



