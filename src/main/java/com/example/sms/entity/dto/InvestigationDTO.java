package com.example.sms.entity.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;

@Data
@ApiModel(description = "事件调查DTO")
public class InvestigationDTO {
    // 基本信息
    @ApiModelProperty("记录类型(event_investigation-事件调查)")
    private String recordType = "event_investigation";
    
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
    
    // 调查信息
    @ApiModelProperty("调查方案")
    private String investigationPlan;
    
    @ApiModelProperty("调查过程记录")
    private String investigationProcess;
    
    @ApiModelProperty("事件调查结论")
    private String investigationConclusion;
    
    // 责任信息
    @ApiModelProperty("责任部门")
    private String responsibleDept;
    
    @ApiModelProperty("责任分部")
    private String responsibleSubdept;
    
    @ApiModelProperty("经办人")
    private String handler;
    
    @ApiModelProperty("联系方式")
    private String handlerContact;
    
    // 分析信息
    @ApiModelProperty("原因分析")
    private String analysis;
    
    @ApiModelProperty("管控措施")
    private String controlMeasures;
    
    @ApiModelProperty("改进措施")
    private String improvementMeasures;
    
    // 相关信息
    @ApiModelProperty("相关手册")
    private String relatedManual;
    
    @ApiModelProperty("关联程序")
    private String relatedProcedure;
    
    @ApiModelProperty("关联法规")
    private String relatedRegulation;
    
    // 通用字段
    @ApiModelProperty("备注")
    private String remarks;
    
    @ApiModelProperty("附件列表")
    private List<MultipartFile> attachments;
} 