package com.example.sms.entity.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

@Data
@TableName("safety_attachments")
public class SafetyAttachment {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long safetyId;
    private String attachmentName;
    private Long attachmentSize;
    private String attachmentType;
    private String attachmentPath;
    private Date uploadTime;
    private String uploadUser;
    private String remarks;
    
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
} 