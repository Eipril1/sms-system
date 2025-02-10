package com.example.sms.controller;

import com.example.sms.common.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "测试接口")
@RestController
@RequestMapping("/test")
public class TestController {
    
    @ApiOperation("测试接口")
    @GetMapping
    public Result<String> test() {
        return Result.success("API is working");
    }
} 