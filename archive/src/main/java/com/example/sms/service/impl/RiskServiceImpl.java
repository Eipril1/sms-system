package com.example.sms.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.sms.common.exception.BusinessException;
import com.example.sms.entity.domain.SafetyManagement;
import com.example.sms.entity.dto.RiskDTO;
import com.example.sms.mapper.SafetyManagementMapper;
import com.example.sms.service.RiskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.sms.common.result.Result;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class RiskServiceImpl implements RiskService {
    
    private final SafetyManagementMapper safetyManagementMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> submitRisk(RiskDTO riskDTO) {
        if (riskDTO == null) {
            throw new BusinessException("风险隐患信息不能为空");
        }
        
        SafetyManagement safetyManagement = new SafetyManagement();
        BeanUtils.copyProperties(riskDTO, safetyManagement);
        
        // 计算风险值
        if (riskDTO.getPossibility() != null && riskDTO.getSeverity() != null) {
            BigDecimal riskValue = riskDTO.getPossibility().multiply(riskDTO.getSeverity());
            safetyManagement.setRiskValue(riskValue);
            // 根据风险值设置风险等级(这里需要根据具体业务规则实现)
            safetyManagement.setRiskLevel(calculateRiskLevel(riskValue));
        }
        
        safetyManagementMapper.insert(safetyManagement);
        
        return Result.success("提交成功");
    }
    
    @Override
    public Result<?> getRiskDetail(Long id) {
        if (id == null) {
            throw new BusinessException("ID不能为空");
        }
        
        SafetyManagement risk = safetyManagementMapper.selectById(id);
        if (risk == null) {
            throw new BusinessException("记录不存在");
        }
        
        return Result.success(risk);
    }
    
    @Override
    public Result<?> getRiskList(Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageSize == null) {
            throw new BusinessException("分页参数不能为空");
        }
        
        LambdaQueryWrapper<SafetyManagement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SafetyManagement::getRecordType, "risk_control")
               .orderByDesc(SafetyManagement::getCreateTime);
        
        Page<SafetyManagement> page = new Page<>(pageNum, pageSize);
        Page<SafetyManagement> result = safetyManagementMapper.selectPage(page, wrapper);
        
        return Result.success(result);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> updateRiskStatus(Long id, String status) {
        if (id == null || status == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement risk = safetyManagementMapper.selectById(id);
        if (risk == null) {
            throw new BusinessException("记录不存在");
        }
        
        risk.setStatus(status);
        safetyManagementMapper.updateById(risk);
        
        return Result.success("更新成功");
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> evaluateRisk(Long id, BigDecimal possibility, BigDecimal severity) {
        if (id == null || possibility == null || severity == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement risk = safetyManagementMapper.selectById(id);
        if (risk == null) {
            throw new BusinessException("记录不存在");
        }
        
        risk.setPossibility(possibility);
        risk.setSeverity(severity);
        BigDecimal riskValue = possibility.multiply(severity);
        risk.setRiskValue(riskValue);
        risk.setRiskLevel(calculateRiskLevel(riskValue));
        
        safetyManagementMapper.updateById(risk);
        
        return Result.success("评估成功");
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<String> evaluateResidualRisk(Long id, BigDecimal possibility, BigDecimal severity) {
        if (id == null || possibility == null || severity == null) {
            throw new BusinessException("参数不能为空");
        }
        
        SafetyManagement risk = safetyManagementMapper.selectById(id);
        if (risk == null) {
            throw new BusinessException("记录不存在");
        }
        
        risk.setResidualPossibility(possibility);
        risk.setResidualSeverity(severity);
        BigDecimal residualRiskValue = possibility.multiply(severity);
        risk.setResidualRiskValue(residualRiskValue);
        risk.setResidualRiskLevel(calculateRiskLevel(residualRiskValue));
        
        safetyManagementMapper.updateById(risk);
        
        return Result.success("评估成功");
    }
    
    /**
     * 根据风险值计算风险等级
     * 这里需要根据具体的业务规则实现
     */
    private String calculateRiskLevel(BigDecimal riskValue) {
        // 示例规则
        if (riskValue.compareTo(new BigDecimal("15")) >= 0) {
            return "高风险";
        } else if (riskValue.compareTo(new BigDecimal("8")) >= 0) {
            return "中风险";
        } else {
            return "低风险";
        }
    }
} 