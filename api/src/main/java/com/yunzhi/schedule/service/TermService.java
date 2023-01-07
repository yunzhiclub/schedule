package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TermService {
    /**
     * 分页.
     * @param name 名称
     * @param pageable 分页信息
     * @return 分页数据
     */
    Page<Term> page(String name, Pageable pageable);
}
