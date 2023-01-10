package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Clazz;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.ClazzRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class ClazzServiceImpl implements ClazzService {

    public ClazzRepository clazzRepository;

    @Autowired
    ClazzServiceImpl(ClazzRepository clazzRepository) {
        this.clazzRepository = clazzRepository;
    }

    @Override
    public Page<Clazz> page(String name, Pageable pageable) {
        return this.clazzRepository.findAllByName(name, pageable);
    }

    @Override
    public Clazz add(Clazz clazz) {
        Assert.notEmpty(Arrays.asList(
                clazz.getName(), clazz.getEntranceDate()
        ), "发生校验错误，请检查输入字段");
        clazz = this.clazzRepository.save(clazz);
        return clazz;
    }

    @Override
    public Clazz getByName(String name) {
        return this.clazzRepository.findByNameAndDeletedFalse(name).orElseThrow(
                () -> new EntityNotFoundException("找不到相关用户"));
    }

    @Override
    public Boolean clazzNameUnique(String name, Long clazzId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的学期，允许名称相同， 返回 false
        //                 其他学期，不允许， 返回 true
        Clazz clazz = this.getByName(name);
        if (Objects.equals(clazz.getId(), clazzId)) {
            return false;
        }
        return true;
    }

    @Override
    public void deleteById(Long clazzId) {
        this.clazzRepository.deleteById(clazzId);
    }

    @Override
    public Clazz getById(Long clazzId) {
        return this.clazzRepository.findById(clazzId).orElseThrow(()
                -> new EntityNotFoundException("未找到对应实体"));
    }

    @Override
    public List<Clazz> getAll() {
        List<Clazz> clazzes = new ArrayList<>();
        this.clazzRepository.findAll().forEach(clazzes::add);
        return clazzes;
    }
}
