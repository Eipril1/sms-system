package com.example.sms.controller;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.InvestigationDTO;
import com.example.sms.service.InvestigationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = "事件调查管理")
@RestController
@RequestMapping("/api/investigation")
@RequiredArgsConstructor
public class InvestigationController {

    private final InvestigationService investigationService;

    @ApiOperation("提交事件调查")
    @PostMapping("/submit")
    public Result<String> submitInvestigation(@RequestBody InvestigationDTO investigationDTO) {
        return investigationService.submitInvestigation(investigationDTO);
    }

    @ApiOperation("获取事件调查详情")
    @GetMapping("/{id}")
    public Result<?> getInvestigationDetail(@PathVariable Long id) {
        return investigationService.getInvestigationDetail(id);
    }

    @ApiOperation("获取事件调查列表")
    @GetMapping("/list")
    public Result<?> getInvestigationList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return investigationService.getInvestigationList(pageNum, pageSize);
    }

    @ApiOperation("更新事件调查状态")
    @PutMapping("/{id}/status")
    public Result<String> updateInvestigationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return investigationService.updateInvestigationStatus(id, status);
    }

    @ApiOperation("关闭事件调查")
    @PutMapping("/{id}/close")
    public Result<String> closeInvestigation(
            @PathVariable Long id,
            @RequestParam String conclusion) {
        return investigationService.closeInvestigation(id, conclusion);
    }
} 