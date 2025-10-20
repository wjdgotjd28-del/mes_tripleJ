package com.mes_back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "routing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Routing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "routing_id")
    private Long routingId;

    @Column(name = "process_code", nullable = false, unique = true, length = 255)
    private String processCode;

    @Column(name = "process_name", nullable = false, length = 255)
    private String processName;

    @Column(name = "process_time", nullable = false)
    private Integer processTime;

    @Column(length = 255)
    private String note;

}
