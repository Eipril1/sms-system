package com.example.sms.service.impl;

import com.example.sms.common.exception.BusinessException;
import com.example.sms.common.result.Result;
import com.example.sms.config.FileUploadConfig;
import com.example.sms.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileUploadConfig fileUploadConfig;
    
    @Override
    public Result<String> uploadFile(MultipartFile file, String module) {
        // 1. 校验文件
        validateFile(file);
        
        // 2. 生成文件路径
        String fileName = generateFileName(file.getOriginalFilename());
        String relativePath = generateRelativePath(module, fileName);
        String absolutePath = fileUploadConfig.getBasePath() + File.separator + relativePath;
        
        // 3. 保存文件
        try {
            File dest = new File(absolutePath);
            FileUtil.mkParentDirs(dest);
            file.transferTo(dest);
            return Result.success(relativePath);
        } catch (Exception e) {
            throw new BusinessException("文件上传失败：" + e.getMessage());
        }
    }
    
    @Override
    public Result<List<String>> uploadFiles(List<MultipartFile> files, String module) {
        List<String> paths = new ArrayList<>();
        for (MultipartFile file : files) {
            Result<String> result = uploadFile(file, module);
            paths.add(result.getData());
        }
        return Result.success(paths);
    }
    
    @Override
    public Result<String> deleteFile(String filePath) {
        if (StrUtil.isBlank(filePath)) {
            throw new BusinessException("文件路径不能为空");
        }
        
        String absolutePath = fileUploadConfig.getBasePath() + File.separator + filePath;
        File file = new File(absolutePath);
        if (file.exists() && file.isFile()) {
            FileUtil.del(file);
        }
        
        return Result.success("删除成功");
    }
    
    /**
     * 校验文件
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("文件不能为空");
        }
        
        // 校验文件大小
        if (file.getSize() > fileUploadConfig.getMaxSize() * 1024 * 1024) {
            throw new BusinessException("文件大小不能超过" + fileUploadConfig.getMaxSize() + "MB");
        }
        
        // 校验文件类型
        String originalFilename = file.getOriginalFilename();
        String suffix = FileUtil.getSuffix(originalFilename);
        if (!Arrays.asList(fileUploadConfig.getAllowTypes()).contains("." + suffix)) {
            throw new BusinessException("不支持的文件类型");
        }
    }
    
    /**
     * 生成文件名
     */
    private String generateFileName(String originalFilename) {
        String suffix = FileUtil.getSuffix(originalFilename);
        return IdUtil.fastSimpleUUID() + "." + suffix;
    }
    
    /**
     * 生成相对路径
     */
    private String generateRelativePath(String module, String fileName) {
        String date = DateUtil.format(DateUtil.date(), "yyyyMMdd");
        return module + File.separator + date + File.separator + fileName;
    }
} 