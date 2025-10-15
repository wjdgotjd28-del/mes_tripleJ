package com.mes_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemImgDTO {
    private Long orderItemImgId;
    private Long orderItemId;
    private String imgUrl;
    private String imgOriName;
    private String imgName;
}
