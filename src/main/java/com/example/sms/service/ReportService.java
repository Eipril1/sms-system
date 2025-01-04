package com.example.sms.service;

import com.example.sms.entity.dto.ReportDTO;
import com.example.sms.common.result.Result;

public interface ReportService {
    /**
     * 提交报告
     */
    Result<String> submitReport(ReportDTO reportDTO);
    
    /**
     * 获取报告详情
     */
    Result<?> getReportDetail(Long id);
    
    /**
     * 获取报告列表
     */
    Result<?> getReportList(String recordType, Integer pageNum, Integer pageSize);
} 