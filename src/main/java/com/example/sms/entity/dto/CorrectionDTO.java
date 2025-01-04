package com.example.sms.entity.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;

@Data
@ApiModel(description = "纠正预防措施DTO")
public class CorrectionDTO {
    // 基本信息
    @ApiModelProperty("记录类型(correction_prevention-纠正预防)")
    private String recordType = "correction_prevention";
    
    @ApiModelProperty("记录编号")
    private String recordNumber;
    
    @ApiModelProperty("来源编号")
    private String sourceNumber;
    
    // 时间信息
    @ApiModelProperty("开始日期")
    private Date startDate;
    
    @ApiModelProperty("结束日期")
    private Date endDate;
    
    @ApiModelProperty("计划完成时限")
    private Date planCompleteTime;
    
    @ApiModelProperty("回复期限")
    private Date deadline;
    
    // 问题信息
    @ApiModelProperty("问题类型")
    private String problemType;
    
    @ApiModelProperty("问题描述")
    private String description;
    
    @ApiModelProperty("原因分析")
    private String analysis;
    
    // 措施信息
    @ApiModelProperty("纠正措施")
    private String controlMeasures;
    
    @ApiModelProperty("预防措施")
    private String preventiveMeasures;
    
    @ApiModelProperty("验证标准")
    private String verificationStandard;
    
    // 责任信息
    @ApiModelProperty("责任部门")
    private String responsibleDept;
    
    @ApiModelProperty("责任分部")
    private String responsibleSubdept;
    
    @ApiModelProperty("经办人")
    private String handler;
    
    @ApiModelProperty("联系方式")
    private String handlerContact;
    
    // 验证信息
    @ApiModelProperty("验证结果")
    private String verificationResult;
    
    @ApiModelProperty("完成情况")
    private String completionStatus;
    
    @ApiModelProperty("跟踪验证情况")
    private String trackingVerification;
    
    // 通用字段
    @ApiModelProperty("备注")
    private String remarks;
    
    @ApiModelProperty("附件列表")
    private List<MultipartFile> attachments;
} 