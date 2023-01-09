package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Student;
import com.yunzhi.schedule.repository.specs.StudentSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface StudentRepository extends PagingAndSortingRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    /**
     * 根据student中name和sno查询学生信息(模糊查询)
     * @param name          学生名称
     * @param sno           学生学号
     * @param pageable      分页信息
     * @return              学生数据
     */
    default Page<Student> findAllByNameAndSnoAndClazzId(String name, String sno, Long clazzId, Pageable pageable) {
        Specification<Student> specification = StudentSpecs.containingName(name)
                .and(StudentSpecs.containingSno(sno))
                .and(StudentSpecs.containingClazzId(clazzId));
        return this.findAll(specification, pageable);
    }
}
