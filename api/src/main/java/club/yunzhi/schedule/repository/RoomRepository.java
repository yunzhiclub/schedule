package club.yunzhi.schedule.repository;

import club.yunzhi.schedule.entity.Room;
import club.yunzhi.schedule.repository.specs.RoomSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface RoomRepository  extends PagingAndSortingRepository<Room, Long>, JpaSpecificationExecutor<Room> {
    /**
     * 根据room中name查询教室信息(模糊查询)
     * 根据room中capacity查询教室信息(模糊查询)
     * @param name          教室名称
     * @param capacity      教室容量
     * @return              教室数据
     */
    default Page<Room> findAll(String name, String capacity, Pageable pageable) {
        Specification<Room> specification = RoomSpecs.containingName(name)
                .and(RoomSpecs.containingCapacity(capacity));
        return this.findAll(specification, pageable);
    }

    Optional<Room> findByNameAndDeletedFalse(String roomName);
}
