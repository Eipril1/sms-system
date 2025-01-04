package com.example.sms.entity.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;

@Data
@ApiModel(description = "信息报告DTO")
public class ReportDTO {
    // 强制报告和自愿报告共同字段
    @ApiModelProperty("记录类型(forced_report-强制报告/voluntary_report-自愿报告)")
    private String recordType;
    
    @ApiModelProperty("记录编号")
    private String recordNumber;
    
    @ApiModelProperty("事发日期")
    private Date occurDate;
    
    @ApiModelProperty("事发时间")
    private String occurTime;
    
    @ApiModelProperty("航班号")
    private String flightNo;
    
    @ApiModelProperty("飞机号")
    private String aircraftNo;
    
    @ApiModelProperty("航段")
    private String flightSegment;
    
    @ApiModelProperty("事发阶段")
    private String occurPhase;
    
    @ApiModelProperty("事发地点")
    private String occurPlace;
    
    @ApiModelProperty("管制区")
    private String controlArea;
    
    @ApiModelProperty("事件类型")
    private String eventType;
    
    @ApiModelProperty("事件经过")
    private String description;
    
    @ApiModelProperty("影响")
    private String impact;
    
    // 强制报告特有字段
    @ApiModelProperty("是否为396事件")
    private Boolean is396Event;
    
    @ApiModelProperty("差错标准")
    private String errorStandard;
    
    @ApiModelProperty("是否需要调查")
    private Boolean needInvestigation;
    
    // 自愿报告特有字段
    @ApiModelProperty("希望处理部门")
    private String hopeHandleDept;
    
    @ApiModelProperty("希望改进措施")
    private String improvementMeasures;
    
    @ApiModelProperty("联系方式")
    private String handlerContact;
    
    // 通用字段
    @ApiModelProperty("备注")
    private String remarks;
    
    @ApiModelProperty("附件列表")
    private List<MultipartFile> attachments;
} 