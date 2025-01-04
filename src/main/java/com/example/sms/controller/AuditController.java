package com.example.sms.controller;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.AuditDTO;
import com.example.sms.service.AuditService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = "监督审核管理")
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @ApiOperation("提交监督审核")
    @PostMapping("/submit")
    public Result<String> submitAudit(@RequestBody AuditDTO auditDTO) {
        return auditService.submitAudit(auditDTO);
    }

    @ApiOperation("获取监督审核详情")
    @GetMapping("/{id}")
    public Result<?> getAuditDetail(@PathVariable Long id) {
        return auditService.getAuditDetail(id);
    }

    @ApiOperation("获取监督审核列表")
    @GetMapping("/list")
    public Result<?> getAuditList(
            @RequestParam String subType,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return auditService.getAuditList(subType, pageNum, pageSize);
    }

    @ApiOperation("更新监督审核状态")
    @PutMapping("/{id}/status")
    public Result<String> updateAuditStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return auditService.updateAuditStatus(id, status);
    }
} 