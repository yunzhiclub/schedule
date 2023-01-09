package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Clazz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Optional;

public interface ClazzRepository extends PagingAndSortingRepository<Clazz, Long>, JpaSpecificationExecutor<Clazz> {

    /**
     * 根据clazz中name查询班级信息(模糊查询)
     * @param name          班级名称
     * @param pageable      分页信息
     * @return              班级数据
     */
    default Page<Clazz> findAllByName(String name, Pageable pageable) {
        Specification<Clazz> specification = new Specification<Clazz>() {
            @Override
            public Predicate toPredicate(Root<Clazz> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.like(root.get("name"), "%" + name + "%");
            }
        };
        return this.findAll(specification, pageable);
    }

    Optional<Clazz> findByName(String name);
}
