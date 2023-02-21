package club.yunzhi.schedule.repository.specs;

import club.yunzhi.schedule.entity.Course;
import org.springframework.data.jpa.domain.Specification;

public class CourseSpecs {
    /**
     * 包含名字.
     * @param name 名称
     * @return 谓语
     */
    public static Specification<Course> containingName(String name) {
        if (name != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }

    /**
     * 包含容量.
     * @param hours 容量
     * @return 谓语
     */
    public static Specification<Course> containingHours(String hours) {
        if (hours != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("hours").as(String.class), String.format("%%%s%%", hours));
        } else {
            return Specification.where(null);
        }
    }
}
