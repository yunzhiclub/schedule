package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.TermRepository;
import com.yunzhi.schedule.vo.StateTerm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

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

    @Override
    public Term add(Term term) {
        Assert.notEmpty(Arrays.asList(
                term.getName(), term.getState(), term.getStartTime(), term.getEndTime()
        ), "发生校验错误，请检查输入字段");
        term = this.termRepository.save(term);
        if (term.getState()) {
            this.activeTerm(term.getId());
        }
        return term;
    }

    @Override
    public Term getByName(String name) {
        return this.termRepository.findByName(name).orElseThrow(
                () -> new EntityNotFoundException("找不到相关用户"));
    }

    @Override
    public Boolean termNameUnique(String name, Long termId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的学期，允许名称相同， 返回 false
        //                 其他学期，不允许， 返回 true
        Term term = this.getByName(name);
        if (Objects.equals(term.getId(), termId)) {
            return false;
        }
        return true;
    }

    @Override
    public void deleteById(Long termId) {
        this.termRepository.deleteById(termId);
    }

    @Override
    public StateTerm activeTerm(Long id) {
        List<Term> terms = this.termRepository.findTermsByStateIsTrue();
        terms.forEach(term -> {
            term.setState(Term.NOT_ACTIVATE);
            this.termRepository.save(term);
        });
        Term term = this.termRepository.findById(id).get();
        term.setState(Term.ACTIVATE);
        term = this.termRepository.save(term);
        StateTerm stateTerm = new StateTerm();
        stateTerm.setState(term.getState());;
        return stateTerm;
    }

    @Override
    public Term getById(Long termId) {
        return this.termRepository.findById(termId).orElseThrow(()
                -> new EntityNotFoundException("未找到对应实体"));
    }
}
