package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ScheduleRepository extends PagingAndSortingRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    List<Schedule> findSchedulesByCourseIdAndTermIdAndDeletedFalse(Long courseId, Long termId);

    List<Schedule> findSchedulesByTermAndDeletedFalse(Term term);
}
