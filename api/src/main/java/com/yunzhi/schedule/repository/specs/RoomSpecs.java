package com.yunzhi.schedule.repository.specs;

import com.yunzhi.schedule.entity.Room;
import org.springframework.data.jpa.domain.Specification;

public class RoomSpecs {
    /**
     * 包含名字.
     * @param name 名称
     * @return 谓语
     */
    public static Specification<Room> containingName(String name) {
        if (name != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }

    /**
     * 包含容量.
     * @param capacity 容量
     * @return 谓语
     */
    public static Specification<Room> containingCapacity(String capacity) {
        if (capacity != null) {
            return (root, criteriaQuery, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("capacity").as(String.class), String.format("%%%s%%", capacity));
        } else {
            return Specification.where(null);
        }
    }
}
