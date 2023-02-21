package club.yunzhi.schedule.repository;

import club.yunzhi.schedule.entity.Teacher;
import club.yunzhi.schedule.repository.specs.TeacherSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;


public interface TeacherRepository  extends PagingAndSortingRepository<Teacher, Long>, JpaSpecificationExecutor<Teacher> {
    /**
     * 根据teacher中name查询教师信息(模糊查询)
     * @param name          教师名称
     * @param pageable      分页信息
     * @return              教师数据
     */
    default Page<Teacher> findAll(String name, String phone, Pageable pageable) {
        Specification<Teacher> specification = TeacherSpecs.containingName(name)
                .and(TeacherSpecs.containingNumber(phone));
        return this.findAll(specification, pageable);
    }

    Optional<Teacher> findByPhoneAndDeletedFalse(String sno);
}
