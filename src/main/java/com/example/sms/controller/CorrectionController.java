package com.example.sms.controller;

import com.example.sms.common.result.Result;
import com.example.sms.entity.dto.CorrectionDTO;
import com.example.sms.service.CorrectionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = "纠正预防措施管理")
@RestController
@RequestMapping("/api/correction")
@RequiredArgsConstructor
public class CorrectionController {

    private final CorrectionService correctionService;

    @ApiOperation("提交纠正预防措施")
    @PostMapping("/submit")
    public Result<String> submitCorrection(@RequestBody CorrectionDTO correctionDTO) {
        return correctionService.submitCorrection(correctionDTO);
    }

    @ApiOperation("获取纠正预防措施详情")
    @GetMapping("/{id}")
    public Result<?> getCorrectionDetail(@PathVariable Long id) {
        return correctionService.getCorrectionDetail(id);
    }

    @ApiOperation("获取纠正预防措施列表")
    @GetMapping("/list")
    public Result<?> getCorrectionList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return correctionService.getCorrectionList(pageNum, pageSize);
    }

    @ApiOperation("更新纠正预防措施状态")
    @PutMapping("/{id}/status")
    public Result<String> updateCorrectionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return correctionService.updateCorrectionStatus(id, status);
    }

    @ApiOperation("验证纠正预防措施")
    @PutMapping("/{id}/verify")
    public Result<String> verifyCorrection(
            @PathVariable Long id,
            @RequestParam String verificationResult) {
        return correctionService.verifyCorrection(id, verificationResult);
    }

    @ApiOperation("关闭纠正预防措施")
    @PutMapping("/{id}/close")
    public Result<String> closeCorrection(
            @PathVariable Long id,
            @RequestParam String completionStatus) {
        return correctionService.closeCorrection(id, completionStatus);
    }
} 