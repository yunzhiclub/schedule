package club.yunzhi.schedule.repository.specs;

import club.yunzhi.schedule.entity.Term;
import org.springframework.data.jpa.domain.Specification;

public class TermSpecs {
    /**
     * 包含名字.
     * @param name 名称
     * @return 谓语
     */
    public static Specification<Term> containingName(String name) {
        if (name != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }
}
