package com.example.sms.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.sms.common.exception.BusinessException;
import com.example.sms.entity.domain.SafetyManagement;
import com.example.sms.entity.dto.InvestigationDTO;
import com.example.sms.mapper.SafetyManagementMapper;
import com.example.sms.service.InvestigationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.sms.common.result.Result;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class InvestigationServiceImpl implements InvestigationService {
    
    private final SafetyManagementMapper safetyManagementMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> submitInvestigation(InvestigationDTO investigationDTO) {
        // 1. 参数校验
        if (investigationDTO == null) {
            throw new BusinessException("调查信息不能为空");
        }
        
        // 2. 转换对象
        SafetyManagement safetyManagement = new SafetyManagement();
        BeanUtils.copyProperties(investigationDTO, safetyManagement);
        
        // 3. 保存调查记录
        safetyManagementMapper.insert(safetyManagement);
        
        // 4. 处理附件 (这里先省略附件处理逻辑)
        
        return Result.success("提交成功");
    }
    
    @Override
    public Result<?> getInvestigationDetail(Long id) {
        if (id == null) {
            throw new BusinessException("调查ID不能为空");
        }
        
        SafetyManagement investigation = safetyManagementMapper.selectById(id);
        if (investigation == null) {
            throw new BusinessException("调查记录不存在");
        }
        
        return Result.success(investigation);
    }
    
    @Override
    public Result<?> getInvestigationList(Integer pageNum, Integer pageSize) {
        // 1. 参数校验
        if (pageNum == null || pageSize == null) {
            throw new BusinessException("分页参数不能为空");
        }
        
        // 2. 构建查询条件
        LambdaQueryWrapper<SafetyManagement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SafetyManagement::getRecordType, "event_investigation")
               .orderByDesc(SafetyManagement::getCreateTime);
        
        // 3. 分页查询
        Page<SafetyManagement> page = new Page<>(pageNum, pageSize);
        Page<SafetyManagement> result = safetyManagementMapper.selectPage(page, wrapper);
        
        return Result.success(result);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> updateInvestigationStatus(Long id, String status) {
        if (id == null || status == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement investigation = safetyManagementMapper.selectById(id);
        if (investigation == null) {
            throw new BusinessException("调查记录不存在");
        }
        
        investigation.setStatus(status);
        safetyManagementMapper.updateById(investigation);
        
        return Result.success("更新成功");
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> closeInvestigation(Long id, String conclusion) {
        if (id == null || conclusion == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement investigation = safetyManagementMapper.selectById(id);
        if (investigation == null) {
            throw new BusinessException("调查记录不存在");
        }
        
        investigation.setInvestigationConclusion(conclusion);
        investigation.setIsClosed(true);
        investigation.setCloseTime(new Date());
        safetyManagementMapper.updateById(investigation);
        
        return Result.success("关闭成功");
    }
} 