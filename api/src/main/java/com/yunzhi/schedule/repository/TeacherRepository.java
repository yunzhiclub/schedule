package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public interface TeacherRepository  extends PagingAndSortingRepository<Teacher, Long>, JpaSpecificationExecutor<Teacher> {
    /**
     * 根据teacher中name查询教师信息(模糊查询)
     * @param name          教师名称
     * @param pageable      分页信息
     * @return              教师数据
     */
    default Page<Teacher> findAllByName(String name, Pageable pageable) {
        Specification<Teacher> specification = new Specification<Teacher>() {
            @Override
            public Predicate toPredicate(Root<Teacher> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.like(root.get("name"), "%" + name + "%");
            }
        };
        return this.findAll(specification, pageable);
    }
}
