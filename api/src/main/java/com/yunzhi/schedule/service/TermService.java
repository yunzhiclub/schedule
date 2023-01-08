package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.vo.StateTerm;
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

    /**
     * 增加学期
     * @param term 学期
     * @return 学期
     */
    Term add(Term term);

    Term getByName(String name);

    /**
     * 学期名称是否存在
     * @param name 学期名
     * @param termId 排除此学期
     * @return 学期
     */
    Boolean termNameUnique(String name, Long termId);

    /**
     * 删除学期
     */
    void deleteById(Long termId);

    StateTerm activeTerm(Long termId);

    Term getById(Long termId);
}
