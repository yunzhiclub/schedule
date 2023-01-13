package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.Course;
import com.yunzhi.schedule.entity.Dispatch;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface DispatchRepository extends PagingAndSortingRepository<Dispatch, Long>, JpaSpecificationExecutor<Dispatch> {
}
