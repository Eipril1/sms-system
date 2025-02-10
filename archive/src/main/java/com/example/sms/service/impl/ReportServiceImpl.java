package com.example.sms.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.sms.common.exception.BusinessException;
import com.example.sms.entity.domain.SafetyManagement;
import com.example.sms.entity.dto.ReportDTO;
import com.example.sms.mapper.SafetyManagementMapper;
import com.example.sms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.sms.common.result.Result;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    
    private final SafetyManagementMapper safetyManagementMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> submitReport(ReportDTO reportDTO) {
        if (reportDTO == null) {
            throw new BusinessException("报告信息不能为空");
        }
        
        SafetyManagement safetyManagement = new SafetyManagement();
        BeanUtils.copyProperties(reportDTO, safetyManagement);
        
        safetyManagementMapper.insert(safetyManagement);
        
        return Result.success("提交成功");
    }
    
    @Override
    public Result<?> getReportDetail(Long id) {
        if (id == null) {
            throw new BusinessException("报告ID不能为空");
        }
        
        SafetyManagement report = safetyManagementMapper.selectById(id);
        if (report == null) {
            throw new BusinessException("报告不存在");
        }
        
        return Result.success(report);
    }
    
    @Override
    public Result<?> getReportList(String recordType, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageSize == null) {
            throw new BusinessException("分页参数不能为空");
        }
        
        LambdaQueryWrapper<SafetyManagement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SafetyManagement::getRecordType, recordType)
               .orderByDesc(SafetyManagement::getCreateTime);
        
        Page<SafetyManagement> page = new Page<>(pageNum, pageSize);
        Page<SafetyManagement> result = safetyManagementMapper.selectPage(page, wrapper);
        
        return Result.success(result);
    }
} 