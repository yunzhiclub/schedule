package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Student;
import com.yunzhi.schedule.repository.specs.StudentSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface StudentRepository extends PagingAndSortingRepository<Student, Long>, JpaSpecificationExecutor<Student> {
    Optional<Student> findByNameAndDeletedFalse(String name);

    Optional<Student> findBySnoAndDeletedFalse(String sno);

    default Page<Student> findAllByNameAndSnoAndClazzId(Long clazzId, String clazzName, String name, String sno, Pageable pageable) {
        Specification<Student> specification = StudentSpecs.containingName(name)
                .and(StudentSpecs.containingSno(sno))
                .and(StudentSpecs.containingClazzName(clazzName));
        if (clazzId != null) {
            specification = specification.and(StudentSpecs.equalClazzId(clazzId));
        }

        return this.findAll(specification, pageable);
    };
}
