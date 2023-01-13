package com.yunzhi.schedule.service;

import com.yunzhi.schedule.repository.DispatchRepository;
import org.springframework.stereotype.Service;

@Service
public class DispatchServiceImpl implements DispatchService{
    private final DispatchRepository dispatchRepository;
    public DispatchServiceImpl(DispatchRepository dispatchRepository) {this.dispatchRepository = dispatchRepository;}
}
