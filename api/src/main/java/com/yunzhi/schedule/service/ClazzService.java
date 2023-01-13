package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Clazz;
import com.yunzhi.schedule.entity.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClazzService {

    /**
     * 分页.
     * @param name 名称
     * @param pageable 分页信息
     * @return 分页数据
     */
    Page<Clazz> page(String name, Pageable pageable);

    /**
     * 增加班级
     * @param clazz 班级
     * @return 班级
     */
    Clazz add(Clazz clazz);

    Clazz getByName(String name);

    /**
     * 班级名称是否存在
     * @param name 班级名
     * @param clazzId 排除此班级
     * @return 班级
     */
    Boolean clazzNameUnique(String name, Long clazzId);

    /**
     * 删除班级
     */
    void deleteById(Long clazzId);


    Clazz getById(Long clazzId);

    List<Clazz> getAll();

    List<Long> getClazzIdsBySchedules(List<Schedule> schedules);
}
