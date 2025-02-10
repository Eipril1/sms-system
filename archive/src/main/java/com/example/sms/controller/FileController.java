package com.example.sms.controller;

import com.example.sms.common.result.Result;
import com.example.sms.service.FileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Api(tags = "文件上传管理")
@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @ApiOperation("上传单个文件")
    @PostMapping("/upload")
    public Result<String> uploadFile(
            @ApiParam("文件") @RequestParam("file") MultipartFile file,
            @ApiParam("模块") @RequestParam("module") String module) {
        return fileService.uploadFile(file, module);
    }

    @ApiOperation("批量上传文件")
    @PostMapping("/upload/batch")
    public Result<List<String>> uploadFiles(
            @ApiParam("文件列表") @RequestParam("files") List<MultipartFile> files,
            @ApiParam("模块") @RequestParam("module") String module) {
        return fileService.uploadFiles(files, module);
    }

    @ApiOperation("删除文件")
    @DeleteMapping
    public Result<String> deleteFile(@ApiParam("文件路径") @RequestParam String filePath) {
        return fileService.deleteFile(filePath);
    }
} 