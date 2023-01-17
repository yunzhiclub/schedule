package com.yunzhi.schedule.repository.specs;

import com.yunzhi.schedule.entity.Student;
import org.springframework.data.jpa.domain.Specification;

public class StudentSpecs {
    /**
     * 包含名字.
     * @param name 名称
     * @return 谓语
     */
    public static Specification<Student> containingName(String name) {
        if (name != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }

    public static Specification<Student> containingSno(String sno) {
        if (sno != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("sno").as(String.class), String.format("%%%s%%", sno));
        } else {
            return Specification.where(null);
        }
    }

    public static Specification<Student> containingClazzId(Long clazzId) {
        if (clazzId != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.equal(root.join("excel").get("id"), clazzId);
        } else {
            return Specification.where(null);
        }
    }
}
