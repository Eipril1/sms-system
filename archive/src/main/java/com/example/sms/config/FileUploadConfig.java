package com.example.sms.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadConfig {
    
    private String basePath;
    
    private Integer maxSize;
    
    private String[] allowTypes;
} 