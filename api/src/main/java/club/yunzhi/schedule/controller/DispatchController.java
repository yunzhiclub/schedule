package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.service.DispatchService;
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
