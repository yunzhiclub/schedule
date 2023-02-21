package club.yunzhi.schedule.repository;

import club.yunzhi.schedule.entity.Dispatch;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface DispatchRepository extends PagingAndSortingRepository<Dispatch, Long>, JpaSpecificationExecutor<Dispatch> {
}
