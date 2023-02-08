package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.specs.ScheduleSpecs;
import com.yunzhi.schedule.repository.specs.TermSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.persistence.criteria.JoinType;
import java.util.List;

public interface ScheduleRepository extends PagingAndSortingRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    List<Schedule> findSchedulesByCourseIdAndTermIdAndDeletedFalse(Long courseId, Long termId);

    List<Schedule> findSchedulesByTermAndDeletedFalse(Term term);

    default Page<Schedule> findAll(String courseName, Long termId, String clazzName, String teacherName, Pageable pageable) {
        Specification<Schedule> specification = ScheduleSpecs.containingName(courseName, "course")
                .and(ScheduleSpecs.relatingTerm(termId))
                .and(ScheduleSpecs.containingName(teacherName, "teacher1")
                    .or(ScheduleSpecs.containingName(teacherName, "teacher2")))
                .and(ScheduleSpecs.containingClazzName(clazzName));
        return this.findAll(specification, pageable);
    }

}
