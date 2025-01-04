package com.example.sms.service;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.RiskDTO;
import java.math.BigDecimal;

public interface RiskService {
    /**
     * 提交风险隐患
     */
    Result<String> submitRisk(RiskDTO riskDTO);
    
    /**
     * 获取风险隐患详情
     */
    Result<?> getRiskDetail(Long id);
    
    /**
     * 获取风险隐患列表
     */
    Result<?> getRiskList(Integer pageNum, Integer pageSize);
    
    /**
     * 更新风险隐患状态
     */
    Result<String> updateRiskStatus(Long id, String status);
    
    /**
     * 评估风险等级
     */
    Result<String> evaluateRisk(Long id, BigDecimal possibility, BigDecimal severity);
    
    /**
     * 评估剩余风险
     */
    Result<String> evaluateResidualRisk(Long id, BigDecimal possibility, BigDecimal severity);
} 