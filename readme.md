

你是一名航司的安全监察部的安全管理员，现在正在设计公司的安全管理系统，主要模块包含信息报告、监督审核、事件调查、纠正预防措施、风险隐患控制、安全绩效（目前先实现其他5个，暂时先不做。绩效实际上是对上面几个模块数据的抓取分析）。要求如下，一个步骤一个步骤来：

第一步构建大框架：从4大支柱12要素来设计页面：

（1）安全政策和目标：1.管理者承诺。2.安全责任。3.任命关键安全人员。4.应急预案协调。5.SMS文件

（2）安全风险管理：1.危险源识别。2.安全风险评价和控制。

（3）安全保证：1.安全绩效评估与监测。2.变更管理。3.SMS持续改进

（4）安全促进：1.安全培训和教育。2.安全交流。

第二步：实现主要功能模块：信息报告、监督审核、事件调查、纠正预防措施、风险隐患控制

由于我是把所有功能模块需要使用的字段设计到一张表中，所以数据库字段如下：

1.信息报告：

```
-- 1. 强制报告
SELECT 
    record_number,        -- 编号
    occur_date,          -- 事发日期
    occur_time,          -- 时间
    aircraft_no,         -- 飞机号
    flight_no,          -- 航班号
    flight_segment,      -- 航段
    occur_phase,        -- 事发阶段
    control_area,       -- 所在管制区
    event_type,         -- 事件类型
    description,        -- 事件经过
    impact,             -- 产生影响
    is_396_event,      -- 是否为396事件
    error_standard,     -- 差错标准
    need_investigation, -- 是否需要调查
    is_closed           -- 是否结案
FROM safety_management 
WHERE record_type = 'forced_report';

-- 2. 自愿报告
SELECT 
    record_number,        -- 信息编号
    occur_date,          -- 事发日期
    aircraft_no,         -- 飞机号
    flight_no,          -- 航班号
    flight_segment,      -- 航段
    occur_place,        -- 事发地
    event_type,         -- 事件类型
    hope_handle_dept,   -- 希望处理部门
    description,        -- 事件经过
    improvement_measures, -- 希望改进措施
    -- 信息流转
    is_distributed,     -- 是否分发至下一部门
    distribute_dept,    -- 分发部门
    is_effective,       -- 报告是否有效
    analysis,           -- 原因分析
    control_measures,   -- 管控措施
    completion_status,  -- 完成情况
    -- 安监部评审
    is_submit_to_safety, -- 是否提交安监部
    audit_result,       -- 评审结果
    is_feedback,        -- 是否反馈
    tracking_verification, -- 跟踪验证情况
    is_closed           -- 是否结案
FROM safety_management 
WHERE record_type = 'voluntary_report';
```

2.监督审核

```
-- 1. 日常检查
SELECT 
    -- 创建检查单任务
    record_number,        -- 检查单编号
    check_project,       -- 监督审核项目
    title,              -- 检查对象
    responsible_dept,    -- 被检查/审核部门
    audit_team_members,  -- 监督审核组成员
    occur_time,         -- 检查时间
    check_location,     -- 检查地点
    check_basis,        -- 检查依据/重点
    creator,            -- 编写人
    auditor,            -- 审核人
    occur_date,         -- 日期
    -- 检查单项
    id,                 -- 序号
    check_item,         -- 检查项目
    check_basis,        -- 检查依据
    check_key_points,   -- 监督审核/要点
    check_situation,    -- 检查情况简述
    check_conclusion    -- 结论判定
FROM safety_management 
WHERE record_type = 'daily_check';

-- 2. 法定自查
SELECT 
    -- 计划及情况跟踪
    id,                 -- 序号
    check_specialty,    -- 检查专业
    plan_complete_time, -- 计划时间
    check_item,         -- 检查项目
    implement_dept,     -- 实施监察单位/部门
    is_executed,        -- 是否执行
    adjust_situation,   -- 调整情况
    remarks,            -- 备注
    -- 问题清单
    record_number,      -- 编号
    title,             -- 安全隐患名称
    problem_type,       -- 问题类型
    risk_type,         -- 隐患类型
    analysis,          -- 原因分析
    control_measures,   -- 关联的风险控制措施
    impact,            -- 关联的后果
    source,            -- 来源
    occur_time,        -- 发现时间
    responsible_dept,   -- 整改单位/部门
    end_date,          -- 整改时间
    control_measures,   -- 整改措施
    emergency_plan,     -- 应急预案
    verify_person,      -- 措施验证人
    verify_time,       -- 措施验证时间
    verification_result, -- 治理效果验证情况
    is_closed,         -- 是否关闭
    close_time         -- 关闭时间
FROM safety_management 
WHERE record_type = 'statutory_check';
```

3.事件调查

```SQl
SELECT 
    occur_date,         -- 事发日期
    occur_time,         -- 时间
    aircraft_no,        -- 飞机号
    flight_no,          -- 航班号
    flight_segment,      -- 航段
    occur_phase,        -- 事发阶段
    control_area,       -- 事发地管制区
    event_type,         -- 事件类型
    description,        -- 事件经过
    impact,             -- 产生影响
    is_396_event,      -- 是否为396事件
    error_standard,     -- 差错标准
    investigation_plan,  -- 调查方案
    investigation_process, -- 调查过程记录
    investigation_conclusion, -- 事件调查结论
    investigation_report_path -- 事件调查报告
FROM safety_management 
WHERE record_type = 'event_investigation';
```

4.纠正预防

```
SELECT 
    -- 基本信息
    source,            -- 来源
    source_number,     -- 来源编号
    record_number,     -- 整改编号
    title,             -- 名称
    start_date,        -- 开始日期
    end_date,          -- 结束日期
    deadline,          -- 回复期限
    handler,           -- 经办人
    handler_contact,   -- 联系方式
    check_location,    -- 检查地点
    -- 问题列表
    description,       -- 问题
    responsible_dept,   -- 责任单位
    deadline,          -- 整改期限
    operation_record,  -- 操作记录
    summary,           -- 小结
    -- 审核记录
    audit_time,        -- 审核时间
    audit_result,      -- 审核结果
    audit_opinion,     -- 审核意见
    auditor            -- 审核人
FROM safety_management 
WHERE record_type = 'correction_prevention';

-- 附件信息（关联表）
SELECT 
    attachment_name,    -- 附件名称
    attachment_size,    -- 附件大小
    upload_time,       -- 上传时间
    upload_user        -- 上传人
FROM safety_attachments 
WHERE safety_id = xxx;
```

5.风险隐患

```sql
-- 1. 系统过程及重要接口描述清单
SELECT 
    id,                -- 序号
    responsible_dept,   -- 责任部门
    responsible_subdept, -- 责任分部
    process_level1,    -- 1级生产/管理子过程
    process_level2,    -- 2级生产/管理子过程
    process_level3,    -- 3级生产/管理子过程
    related_professional, -- 关联专业或过程接口
    related_manual,    -- 相关手册
    related_procedure, -- 关联程序或作业指导书
    remarks            -- 备注
FROM safety_management 
WHERE record_type = 'system_process';

-- 2. 风险管理过程清单
SELECT 
    id,                -- 序号
    responsible_dept,   -- 涉及部门
    responsible_subdept, -- 责任分部
    process_level1,    -- 一级生产/管理过程
    process_level2,    -- 二级生产/管理子过程
    process_level3,    -- 三级生产/管理子过程
    check_basis,       -- 依据
    related_regulation, -- 法规
    danger_source_desc, -- 危险源描述
    danger_source_code, -- 危险源编号
    is_major_danger,   -- 重大危险源
    danger_source,     -- 危险源来源
    impact,            -- 可能导致的后果
    control_measures,   -- 现有风险控制措施
    related_error_standard, -- 关联的差错标准
    related_error_level, -- 关联的差错等级
    related_post,      -- 关联岗位或过程接口
    time_state,        -- 时态
    status,            -- 状态
    possibility,       -- 可能性F
    severity,          -- 严重性C
    risk_value,        -- 风险矩阵法风险值
    risk_level,        -- 风险等级
    acceptance_level,   -- 可接受程度
    analysis,          -- 根原因分析
    control_measures,   -- 风险控制措施
    emergency_plan,     -- 应急处置
    residual_possibility, -- 可能性F（剩余风险）
    residual_severity,  -- 严重性C（剩余风险）
    residual_risk_value, -- 风险值（剩余风险）
    residual_risk_level, -- 风险评价分级（剩余风险）
    is_new_danger,     -- 是否衍生新的危险源
    is_stored,         -- 是否入库
    available_status,   -- 可用状态
    plan_complete_time, -- 计划完成时限
    status,            -- 完成状态
    verification_result, -- 完成情况验证
    is_core_risk,      -- 核心风险
    remarks            -- 备注
FROM safety_management 
WHERE record_type = 'risk_management';

-- 3. 安全隐患动态控制清单
SELECT 
    -- 隐患信息
    source,            -- 来源
    occur_time,        -- 发现时间
    description,       -- 信息简述
    record_number,     -- 隐患编号
    title,             -- 安全隐患名称
    related_sid,       -- 关联的SID编号
    risk_level,        -- 安全隐患等级
    risk_type,         -- 隐患的类别
    analysis,          -- 原因分析
    -- 风险评估
    process_level1,    -- 一级生产/管理子过程
    process_level2,    -- 二级生产/管理子过程
    process_level3,    -- 三级生产/管理子过程
    related_post,      -- 关联岗位或过程接口
    danger_source_code, -- 关联的危险源编号
    danger_source_desc, -- 危险源名称
    impact,            -- 关联的后果
    risk_level,        -- 风险等级
    control_measures,   -- 关联的风险控制措施
    post_control_measures, -- 评估后的控制措施
    emergency_plan,     -- 应急预案
    related_kpi,       -- 关联的绩效指标
    -- 隐患治理
    end_date,          -- 整改时间
    control_measures,   -- 整改措施
    responsible_dept,   -- 整改单位/部门
    deadline,          -- 完成时限
    reform_funds,      -- 整改资金
    verification_standard, -- 验证标准
    verification_result, -- 治理效果验证情况
    verify_person,      -- 措施验证人
    verify_time,       -- 措施验证时间
    is_closed,         -- 是否关闭
    close_time,        -- 关闭时间
    remarks            -- 备注
FROM safety_management 
WHERE record_type = 'hazard_control';
```

数据流向

信息报告（自愿报告）->监督审核->事件调查->纠正预防措施->风险隐患控制->最终闭环管理

其中部分中间步骤可以省略。
