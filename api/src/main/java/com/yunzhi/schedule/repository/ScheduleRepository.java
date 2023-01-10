package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ScheduleRepository extends PagingAndSortingRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    List<Schedule> findSchedulesByCourseIdAndTermId(Long courseId, Long termId);
}
