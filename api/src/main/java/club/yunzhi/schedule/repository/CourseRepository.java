package club.yunzhi.schedule.repository;

import club.yunzhi.schedule.entity.Course;
import club.yunzhi.schedule.repository.specs.CourseSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface CourseRepository extends PagingAndSortingRepository<Course, Long>, JpaSpecificationExecutor<Course> {
    /**
     * 根据course中name查询教室信息(模糊查询)
     * 根据course中jours查询教室信息(模糊查询)
     * @param name          教室名称
     * @param hours         教室容量
     * @return              教室数据
     */
    default Page<Course> findAll(String name, String hours, Pageable pageable) {
        Specification<Course> specification = CourseSpecs.containingName(name)
                .and(CourseSpecs.containingHours(hours));
        return this.findAll(specification, pageable);
    }
}
