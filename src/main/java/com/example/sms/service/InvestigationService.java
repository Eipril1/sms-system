package com.example.sms.service;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.InvestigationDTO;

public interface InvestigationService {
    /**
     * 提交事件调查
     */
    Result<String> submitInvestigation(InvestigationDTO investigationDTO);
    
    /**
     * 获取事件调查详情
     */
    Result<?> getInvestigationDetail(Long id);
    
    /**
     * 获取事件调查列表
     */
    Result<?> getInvestigationList(Integer pageNum, Integer pageSize);
    
    /**
     * 更新事件调查状态
     */
    Result<String> updateInvestigationStatus(Long id, String status);
    
    /**
     * 关闭事件调查
     */
    Result<String> closeInvestigation(Long id, String conclusion);
} 