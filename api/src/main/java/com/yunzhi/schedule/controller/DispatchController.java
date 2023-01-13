package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.service.CourseService;
import com.yunzhi.schedule.service.DispatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("dispatch")
public class DispatchController {
    private DispatchService dispatchService;

    @Autowired
    DispatchController(DispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }
}
