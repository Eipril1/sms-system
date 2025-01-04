package com.example.sms.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.sms.common.exception.BusinessException;
import com.example.sms.entity.domain.SafetyManagement;
import com.example.sms.entity.dto.CorrectionDTO;
import com.example.sms.mapper.SafetyManagementMapper;
import com.example.sms.service.CorrectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.sms.common.result.Result;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class CorrectionServiceImpl implements CorrectionService {
    
    private final SafetyManagementMapper safetyManagementMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> submitCorrection(CorrectionDTO correctionDTO) {
        if (correctionDTO == null) {
            throw new BusinessException("纠正预防措施信息不能为空");
        }
        
        SafetyManagement safetyManagement = new SafetyManagement();
        BeanUtils.copyProperties(correctionDTO, safetyManagement);
        
        safetyManagementMapper.insert(safetyManagement);
        
        return Result.success("提交成功");
    }
    
    @Override
    public Result<?> getCorrectionDetail(Long id) {
        if (id == null) {
            throw new BusinessException("ID不能为空");
        }
        
        SafetyManagement correction = safetyManagementMapper.selectById(id);
        if (correction == null) {
            throw new BusinessException("记录不存在");
        }
        
        return Result.success(correction);
    }
    
    @Override
    public Result<?> getCorrectionList(Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageSize == null) {
            throw new BusinessException("分页参数不能为空");
        }
        
        LambdaQueryWrapper<SafetyManagement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SafetyManagement::getRecordType, "correction_prevention")
               .orderByDesc(SafetyManagement::getCreateTime);
        
        Page<SafetyManagement> page = new Page<>(pageNum, pageSize);
        Page<SafetyManagement> result = safetyManagementMapper.selectPage(page, wrapper);
        
        return Result.success(result);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> updateCorrectionStatus(Long id, String status) {
        if (id == null || status == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement correction = safetyManagementMapper.selectById(id);
        if (correction == null) {
            throw new BusinessException("记录不存在");
        }
        
        correction.setStatus(status);
        safetyManagementMapper.updateById(correction);
        
        return Result.success("更新成功");
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> verifyCorrection(Long id, String verificationResult) {
        if (id == null || verificationResult == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement correction = safetyManagementMapper.selectById(id);
        if (correction == null) {
            throw new BusinessException("记录不存在");
        }
        
        correction.setVerificationResult(verificationResult);
        correction.setVerifyTime(new Date());
        safetyManagementMapper.updateById(correction);
        
        return Result.success("验证成功");
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> closeCorrection(Long id, String completionStatus) {
        if (id == null || completionStatus == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement correction = safetyManagementMapper.selectById(id);
        if (correction == null) {
            throw new BusinessException("记录不存在");
        }
        
        correction.setCompletionStatus(completionStatus);
        correction.setIsClosed(true);
        correction.setCloseTime(new Date());
        safetyManagementMapper.updateById(correction);
        
        return Result.success("关闭成功");
    }
} 