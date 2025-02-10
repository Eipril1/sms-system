package com.example.sms.entity.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;

@Data
@ApiModel(description = "监督审核DTO")
public class AuditDTO {
    // 基本信息
    @ApiModelProperty("记录类型(supervision_audit-监督审核)")
    private String recordType = "supervision_audit";
    
    @ApiModelProperty("子类型(daily_check-日常检查/legal_check-法定自查)")
    private String subType;
    
    @ApiModelProperty("记录编号")
    private String recordNumber;
    
    // 时间信息
    @ApiModelProperty("开始日期")
    private Date startDate;
    
    @ApiModelProperty("结束日期")
    private Date endDate;
    
    @ApiModelProperty("计划完成时限")
    private Date planCompleteTime;
    
    // 检查信息
    @ApiModelProperty("检查地点")
    private String checkLocation;
    
    @ApiModelProperty("实施监察单位/部门")
    private String implementDept;
    
    @ApiModelProperty("监督审核组成员")
    private String auditTeamMembers;
    
    @ApiModelProperty("检查项目")
    private String checkProject;
    
    @ApiModelProperty("检查依据/重点")
    private String checkBasis;
    
    @ApiModelProperty("检查项目")
    private String checkItem;
    
    @ApiModelProperty("监督审核/要点")
    private String checkKeyPoints;
    
    @ApiModelProperty("检查情况简述")
    private String checkSituation;
    
    @ApiModelProperty("结论判定")
    private String checkConclusion;
    
    @ApiModelProperty("检查专业")
    private String checkSpecialty;
    
    // 问题信息
    @ApiModelProperty("问题类型")
    private String problemType;
    
    @ApiModelProperty("责任部门/整改单位")
    private String responsibleDept;
    
    @ApiModelProperty("责任分部")
    private String responsibleSubdept;
    
    // 过程信息
    @ApiModelProperty("一级生产/管理子过程")
    private String processLevel1;
    
    @ApiModelProperty("二级生产/管理子过程")
    private String processLevel2;
    
    @ApiModelProperty("三级生产/管理子过程")
    private String processLevel3;
    
    @ApiModelProperty("关联专业或过程接口")
    private String relatedProfessional;
    
    @ApiModelProperty("关联岗位")
    private String relatedPost;
    
    // 通用字段
    @ApiModelProperty("备注")
    private String remarks;
    
    @ApiModelProperty("附件列表")
    private List<MultipartFile> attachments;
} 