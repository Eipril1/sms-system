package com.example.sms.entity.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@Data
@ApiModel(description = "风险隐患控制DTO")
public class RiskDTO {
    // 基本信息
    @ApiModelProperty("记录类型(risk_control-风险隐患)")
    private String recordType = "risk_control";
    
    @ApiModelProperty("记录编号")
    private String recordNumber;
    
    @ApiModelProperty("来源编号")
    private String sourceNumber;
    
    // 危险源信息
    @ApiModelProperty("危险源编号")
    private String dangerSourceCode;
    
    @ApiModelProperty("危险源描述")
    private String dangerSourceDesc;
    
    @ApiModelProperty("是否重大危险源")
    private Boolean isMajorDanger;
    
    @ApiModelProperty("危险源来源")
    private String dangerSource;
    
    @ApiModelProperty("时态(过去/现在/将来)")
    private String timeState;
    
    // 风险评估
    @ApiModelProperty("可能性F")
    private BigDecimal possibility;
    
    @ApiModelProperty("严重性C")
    private BigDecimal severity;
    
    @ApiModelProperty("风险值R=C*F")
    private BigDecimal riskValue;
    
    @ApiModelProperty("风险等级")
    private String riskLevel;
    
    @ApiModelProperty("可接受程度")
    private String acceptanceLevel;
    
    // 控制措施
    @ApiModelProperty("管控措施")
    private String controlMeasures;
    
    @ApiModelProperty("应急预案")
    private String emergencyPlan;
    
    // 剩余风险评估
    @ApiModelProperty("剩余风险可能性")
    private BigDecimal residualPossibility;
    
    @ApiModelProperty("剩余风险严重性")
    private BigDecimal residualSeverity;
    
    @ApiModelProperty("剩余风险值")
    private BigDecimal residualRiskValue;
    
    @ApiModelProperty("剩余风险等级")
    private String residualRiskLevel;
    
    // 责任信息
    @ApiModelProperty("责任部门")
    private String responsibleDept;
    
    @ApiModelProperty("责任分部")
    private String responsibleSubdept;
    
    @ApiModelProperty("经办人")
    private String handler;
    
    // 相关信息
    @ApiModelProperty("相关手册")
    private String relatedManual;
    
    @ApiModelProperty("关联程序")
    private String relatedProcedure;
    
    @ApiModelProperty("关联法规")
    private String relatedRegulation;
    
    @ApiModelProperty("关联KPI")
    private String relatedKpi;
    
    // 通用字段
    @ApiModelProperty("备注")
    private String remarks;
    
    @ApiModelProperty("附件列表")
    private List<MultipartFile> attachments;
}