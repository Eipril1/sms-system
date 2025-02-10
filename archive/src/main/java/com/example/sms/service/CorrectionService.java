package com.example.sms.service;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.CorrectionDTO;

public interface CorrectionService {
    /**
     * 提交纠正预防措施
     */
    Result<String> submitCorrection(CorrectionDTO correctionDTO);
    
    /**
     * 获取纠正预防措施详情
     */
    Result<?> getCorrectionDetail(Long id);
    
    /**
     * 获取纠正预防措施列表
     */
    Result<?> getCorrectionList(Integer pageNum, Integer pageSize);
    
    /**
     * 更新纠正预防措施状态
     */
    Result<String> updateCorrectionStatus(Long id, String status);
    
    /**
     * 验证纠正预防措施
     */
    Result<String> verifyCorrection(Long id, String verificationResult);
    
    /**
     * 关闭纠正预防措施
     */
    Result<String> closeCorrection(Long id, String completionStatus);
} 