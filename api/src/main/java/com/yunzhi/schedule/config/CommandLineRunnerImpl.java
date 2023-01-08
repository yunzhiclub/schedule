package com.yunzhi.schedule.config;

import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.TermRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


/**
 * 系统启动时添加系统管理员
 */
@Component
public class CommandLineRunnerImpl implements CommandLineRunner {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final TermRepository termRepository;

    @Autowired
    public CommandLineRunnerImpl(TermRepository termRepository) {
        this.termRepository = termRepository;
    }

    @Override
    public void run(String... args) {
        for (int i = 0; i < 200; i+=2) {
            this.addTerm("学期" + i, false, 1672502400L, 1688140800L);
            this.addTerm("学期" + (i + 1), false, 1672502400L, 1688140800L);
        }
    }

    private Term addTerm(String name, Boolean state, Long startTime, Long endTime) {
        Term term = new Term();
        term.setName(name);
        term.setState(state);
        term.setStartTime(startTime);
        term.setEndTime(endTime);
        return this.termRepository.save(term);
    }
}
