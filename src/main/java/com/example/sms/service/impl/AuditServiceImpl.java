package com.example.sms.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.sms.common.exception.BusinessException;
import com.example.sms.entity.domain.SafetyManagement;
import com.example.sms.entity.dto.AuditDTO;
import com.example.sms.mapper.SafetyManagementMapper;
import com.example.sms.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.sms.common.result.Result;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {
    
    private final SafetyManagementMapper safetyManagementMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> submitAudit(AuditDTO auditDTO) {
        if (auditDTO == null) {
            throw new BusinessException("审核信息不能为空");
        }
        
        SafetyManagement safetyManagement = new SafetyManagement();
        BeanUtils.copyProperties(auditDTO, safetyManagement);
        
        safetyManagementMapper.insert(safetyManagement);
        
        return Result.success("提交成功");
    }
    
    @Override
    public Result<?> getAuditDetail(Long id) {
        if (id == null) {
            throw new BusinessException("审核ID不能为空");
        }
        
        SafetyManagement audit = safetyManagementMapper.selectById(id);
        if (audit == null) {
            throw new BusinessException("审核记录不存在");
        }
        
        return Result.success(audit);
    }
    
    @Override
    public Result<?> getAuditList(String subType, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageSize == null) {
            throw new BusinessException("分页参数不能为空");
        }
        
        LambdaQueryWrapper<SafetyManagement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SafetyManagement::getRecordType, "supervision_audit")
               .eq(SafetyManagement::getSubType, subType)
               .orderByDesc(SafetyManagement::getCreateTime);
        
        Page<SafetyManagement> page = new Page<>(pageNum, pageSize);
        Page<SafetyManagement> result = safetyManagementMapper.selectPage(page, wrapper);
        
        return Result.success(result);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> updateAuditStatus(Long id, String status) {
        if (id == null || status == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement audit = safetyManagementMapper.selectById(id);
        if (audit == null) {
            throw new BusinessException("审核记录不存在");
        }
        
        audit.setStatus(status);
        safetyManagementMapper.updateById(audit);
        
        return Result.success("更新成功");
    }
} 