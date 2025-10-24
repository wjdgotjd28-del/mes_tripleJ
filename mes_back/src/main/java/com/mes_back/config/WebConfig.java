package com.mes_back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowedOriginPatterns( "http://localhost:5173")
                .allowedOriginPatterns("http://172.20.20.14")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Value("${file.imgFileLocation}")
    private String imgFileLocation;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                // 실제 파일 위치: file:///C:/upload/image/
                // (boardFileLocation 경로의 파일을 URL로 접근 가능하게 함)
                .addResourceLocations("file:///" + imgFileLocation + "/")
                // 캐시 유지 시간 (초 단위) → 3600초 = 1시간
                .setCachePeriod(3600)
                // 정적 리소스 최적화 체인 활성화
                .resourceChain(true);

        registry.addResourceHandler("/dtl/**")
                .addResourceLocations("file:///" + imgFileLocation + "/")
                .setCachePeriod(3600)
                .resourceChain(true);
    }
}

