package com.example.sms.service;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.AuditDTO;

public interface AuditService {
    /**
     * 提交监督审核
     */
    Result<String> submitAudit(AuditDTO auditDTO);
    
    /**
     * 获取监督审核详情
     */
    Result<?> getAuditDetail(Long id);
    
    /**
     * 获取监督审核列表
     */
    Result<?> getAuditList(String subType, Integer pageNum, Integer pageSize);
    
    /**
     * 更新监督审核状态
     */
    Result<String> updateAuditStatus(Long id, String status);
} 