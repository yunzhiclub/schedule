package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TermServiceImpl implements TermService {
    private final TermRepository termRepository;

    @Autowired
    public TermServiceImpl(TermRepository termRepository) {
        this.termRepository = termRepository;
    }

    @Override
    public Page<Term> page(String name, Pageable pageable) {
        return this.termRepository.findAllByName(name, pageable);
    }
}
