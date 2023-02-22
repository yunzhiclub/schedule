package club.yunzhi.schedule.repository.specs;

import club.yunzhi.schedule.entity.Schedule;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.JoinType;

public class ScheduleSpecs {

    public static Specification<Schedule> containingName(String name, String tableName) {
        if (tableName == null) tableName = "course";
        if (name != null) {
            String finalTableName = tableName;
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.join(finalTableName).get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }
    public static Specification<Schedule> relatingTerm(Long termId) {
        if (termId != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.equal(root.join("term").get("id").as(Long.class), termId);
        } else {
            return Specification.where(null);
        }
    }


    /**
     * 按名称查找
     *
     * @param clazzName
     * @return
     */
    public static Specification<Schedule> containingClazzName(String clazzName) {
        if (clazzName != null && !clazzName.trim().isEmpty()) {
            return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.join("clazzes", JoinType.LEFT)
                    .get("name").as(String.class), String.format("%%%s%%", clazzName.trim()));
        } else {
            return Specification.where(null);
        }
    }

}
