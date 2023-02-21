package club.yunzhi.schedule.repository;

import club.yunzhi.schedule.entity.Term;
import club.yunzhi.schedule.repository.specs.TermSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface TermRepository extends PagingAndSortingRepository<Term, Long>, JpaSpecificationExecutor<Term> {

    /**
     * 根据term中name查询学期信息(模糊查询)
     * @param name          学期姓名
     * @param pageable      分页信息
     * @return              学期数据
     */
    default Page<Term> findAllByName(String name, Pageable pageable) {
        Specification<Term> specification = TermSpecs.containingName(name);
        return this.findAll(specification, pageable);
    }

    List<Term> findTermsByStateIsTrueAndDeletedFalse();

    Optional<Term> findByNameAndDeletedFalse(String name);

    Term findTermByStateAndDeletedFalse(Boolean state);
}
