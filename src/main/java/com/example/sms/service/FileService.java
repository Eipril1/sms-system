package com.example.sms.service;

import com.example.sms.common.result.Result;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface FileService {
    /**
     * 上传单个文件
     */
    Result<String> uploadFile(MultipartFile file, String module);
    
    /**
     * 批量上传文件
     */
    Result<List<String>> uploadFiles(List<MultipartFile> files, String module);
    
    /**
     * 删除文件
     */
    Result<String> deleteFile(String filePath);
} 