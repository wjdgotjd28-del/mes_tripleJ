package com.mes_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemImgDTO {
    @JsonProperty("order_item_img_id")
    private Long orderItemImgId;

    @JsonProperty("order_item_id")
    private Long orderItemId;

    @JsonProperty("img_url")
    private String imgUrl;

    @JsonProperty("img_ori_name")
    private String imgOriName;

    @JsonProperty("img_name")
    private String imgName;
}
