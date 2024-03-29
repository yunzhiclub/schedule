package club.yunzhi.schedule.service;

import club.yunzhi.schedule.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoomService {
    Page<Room> page(String name, String capacity, Pageable pageable);

    Room save(Room room);

    Room getById(Long id);

    Room update(Long id, Room room);

    void deleteById(Long id);

    Boolean roomNameUnique(String roomName, Long roomId);

    /**
     * 获取所有教室
     */
    List<Room> getAll();
}
