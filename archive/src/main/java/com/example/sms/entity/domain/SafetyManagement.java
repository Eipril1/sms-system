package com.example.sms.entity.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
@TableName("safety_management")
public class SafetyManagement {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    // 基本信息
    private String recordType;        // 记录类型(强制报告/自愿报告/监督审核/事件调查/纠正预防/风险隐患)
    private String subType;           // 子类型(日常检查/法定自查/系统过程/风险管理/隐患控制等)
    private String recordNumber;      // 编号
    
    // 时间相关
    private Date occurDate;           // 事发日期
    private Date occurTime;           // 发生时间
    private Date startDate;           // 开始日期
    private Date endDate;            // 结束日期
    private Date deadline;           // 回复期限
    private Date planCompleteTime;   // 计划完成时限
    private Date verifyTime;         // 措施验证时间
    private Date closeTime;          // 关闭时间
    private Date adjustTime;         // 调整时间
    
    // 航班相关
    private String flightNo;          // 航班号
    private String aircraftNo;        // 飞机号
    private String flightSegment;     // 航段
    private String occurPhase;        // 事发阶段
    private String occurPlace;        // 事发地
    private String controlArea;       // 管制区
    
    // 部门与人员
    private String checkLocation;     // 检查地点
    private String responsibleDept;   // 责任部门
    private String responsibleSubdept; // 责任分部
    private String hopeHandleDept;    // 希望处理部门
    private String distributeDept;    // 分发部门
    private String implementDept;     // 实施监察单位
    private String handler;           // 经办人
    private String handlerContact;    // 联系方式
    private String auditor;           // 审核人
    private String creator;           // 编写人
    private String verifyPerson;      // 措施验证人
    private String auditTeamMembers;  // 监督审核组成员
    
    // 事件与问题
    private String eventType;         // 事件类型
    private String problemType;       // 问题类型
    private String riskType;          // 隐患类型
    private String errorStandard;     // 差错标准
    private String source;            // 来源
    
    // 过程相关
    private String processLevel1;     // 一级生产/管理子过程
    private String processLevel2;     // 二级生产/管理子过程
    private String processLevel3;     // 三级生产/管理子过程
    private String relatedProfessional; // 关联专业
    private String relatedPost;       // 关联岗位
    
    // 描述字段
    private String title;             // 标题
    private String description;       // 事件经过
    private String impact;            // 影响
    private String improvementMeasures; // 改进措施
    private String analysis;          // 原因分析
    private String controlMeasures;   // 管控措施
    private String completionStatus;  // 完成情况
    private String emergencyPlan;     // 应急预案
    private String verificationStandard; // 验证标准
    private String verificationResult;  // 验证结果
    
    // 检查相关
    private String checkProject;      // 检查项目
    private String checkBasis;        // 检查依据
    private String checkItem;         // 检查项目
    private String checkKeyPoints;    // 检查要点
    private String checkSituation;    // 检查情况
    private String checkConclusion;   // 检查结论
    private String checkSpecialty;    // 检查专业
    
    // 调查相关
    private String investigationPlan;    // 调查方案
    private String investigationProcess; // 调查过程
    private String investigationConclusion; // 调查结论
    private String investigationReportPath; // 调查报告路径
    
    // 危险源相关
    private String dangerSourceCode;     // 危险源编号
    private String dangerSourceDesc;     // 危险源描述
    private Boolean isMajorDanger;       // 是否重大危险源
    private String dangerSource;         // 危险源来源
    private String timeState;            // 时态
    
    // 风险评估
    private BigDecimal possibility;      // 可能性
    private BigDecimal severity;         // 严重性
    private BigDecimal riskValue;        // 风险值
    private String riskLevel;            // 风险等级
    private String acceptanceLevel;      // 可接受程度
    private BigDecimal residualPossibility; // 剩余风险可能性
    private BigDecimal residualSeverity;    // 剩余风险严重性
    private BigDecimal residualRiskValue;   // 剩余风险值
    private String residualRiskLevel;       // 剩余风险等级
    
    // 关联信息
    private String relatedManual;        // 相关手册
    private String relatedProcedure;     // 关联程序
    private String relatedRegulation;    // 关联法规
    private String relatedErrorStandard; // 关联差错标准
    private String relatedErrorLevel;    // 关联差错等级
    private String relatedKpi;           // 关联KPI
    private String relatedSid;           // 关联SID
    
    // 其他字段
    private BigDecimal reformFunds;      // 整改资金
    private Boolean is396Event;          // 是否396事件
    private Boolean needInvestigation;   // 是否需要调查
    private Boolean isDistributed;       // 是否分发
    private Boolean isEffective;         // 是否有效
    private Boolean isSubmitToSafety;    // 是否提交安监部
    private Boolean isFeedback;          // 是否反馈
    private Boolean isClosed;            // 是否结案
    private Boolean isExecuted;          // 是否执行
    private Boolean isCoreRisk;          // 是否核心风险
    private Boolean isNewDanger;         // 是否新危险源
    private Boolean isStored;            // 是否入库
    
    private String availableStatus;      // 可用状态
    private String status;               // 状态
    
    // 审核相关
    private Date auditTime;              // 审核时间
    private String auditResult;          // 审核结果
    private String auditOpinion;         // 审核意见
    private String trackingVerification; // 跟踪验证
    
    // 基础字段
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;             // 创建时间
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;             // 更新时间
    
    private String createUser;           // 创建人
    private String updateUser;           // 更新人
    private String remarks;              // 备注
    
    // JSON扩展字段
    private String extJson;              // 扩展字段
    
    // 其他补充字段
    private String adjustSituation;      // 调整情况
    private String sourceNumber;         // 来源编号
    private String operationRecord;      // 操作记录
    private String summary;              // 小结
    private String postControlMeasures;  // 评估后控制措施
} 