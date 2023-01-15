package com.yunzhi.schedule.repository.specs;

import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;
import org.springframework.data.jpa.domain.Specification;

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
}
