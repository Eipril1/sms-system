package com.example.sms.controller;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.RiskDTO;
import com.example.sms.service.RiskService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@Api(tags = "风险隐患控制管理")
@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
public class RiskController {

    private final RiskService riskService;

    @ApiOperation("提交风险隐患")
    @PostMapping("/submit")
    public Result<String> submitRisk(@RequestBody RiskDTO riskDTO) {
        return riskService.submitRisk(riskDTO);
    }

    @ApiOperation("获取风险隐患详情")
    @GetMapping("/{id}")
    public Result<?> getRiskDetail(@PathVariable Long id) {
        return riskService.getRiskDetail(id);
    }

    @ApiOperation("获取风险隐患列表")
    @GetMapping("/list")
    public Result<?> getRiskList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return riskService.getRiskList(pageNum, pageSize);
    }

    @ApiOperation("更新风险隐患状态")
    @PutMapping("/{id}/status")
    public Result<String> updateRiskStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return riskService.updateRiskStatus(id, status);
    }

    @ApiOperation("评估风险等级")
    @PutMapping("/{id}/evaluate")
    public Result<String> evaluateRisk(
            @PathVariable Long id,
            @RequestParam BigDecimal possibility,
            @RequestParam BigDecimal severity) {
        return riskService.evaluateRisk(id, possibility, severity);
    }

    @ApiOperation("评估剩余风险")
    @PutMapping("/{id}/evaluate-residual")
    public Result<String> evaluateResidualRisk(
            @PathVariable Long id,
            @RequestParam BigDecimal possibility,
            @RequestParam BigDecimal severity) {
        return riskService.evaluateResidualRisk(id, possibility, severity);
    }
} 