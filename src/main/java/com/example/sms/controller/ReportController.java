package com.example.sms.controller;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.ReportDTO;
import com.example.sms.service.ReportService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Api(tags = "信息报告管理")
@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3003", allowCredentials = "false")
public class ReportController {

    private final ReportService reportService;

    @ApiOperation("提交报告")
    @PostMapping("/submit")
    public Result<String> submitReport(@RequestBody ReportDTO reportDTO) {
        log.info("Received report submission: {}", reportDTO);
        try {
            return reportService.submitReport(reportDTO);
        } catch (Exception e) {
            log.error("Submit report error", e);
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/test")
    public Result<String> test() {
        return Result.success("API is working");
    }

    @ApiOperation("获取报告详情")
    @GetMapping("/{id}")
    public Result<?> getReportDetail(@PathVariable Long id) {
        return reportService.getReportDetail(id);
    }

    @ApiOperation("获取报告列表")
    @GetMapping("/list")
    public Result<?> getReportList(
            @RequestParam String recordType,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return reportService.getReportList(recordType, pageNum, pageSize);
    }
} 