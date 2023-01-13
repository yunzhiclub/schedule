package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Room;
import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.repository.RoomRepository;
import com.yunzhi.schedule.repository.TeacherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.Objects;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    public RoomServiceImpl(RoomRepository roomRepository) {this.roomRepository = roomRepository;}

    @Override
    public Page<Room> page(String name, String capacity, Pageable pageable) {
        return this.roomRepository.findAll(name, capacity, pageable);
    }

    @Override
    public Room save(Room room) {
        Assert.notNull(room.getName(), "名称不能为空");
        Assert.notNull(room.getCapacity(), "容量不能为空");
        return this.roomRepository.save(room);
    }

    @Override
    public Room getById(Long id) {
        return this.roomRepository.findById(id).get();
    }

    @Override
    public Room update(Long id, Room room) {
        Assert.notNull(room.getName(), "name不能为null");
        Assert.notNull(room.getCapacity(), "capacity不能为null");
        Room OldRoom = this.getById(id);
        OldRoom.setName(room.getName());
        OldRoom.setCapacity(room.getCapacity());
        return this.roomRepository.save(OldRoom);
    }

    @Override
    public void deleteById(Long id) {
        this.roomRepository.deleteById(id);
    }

    @Override
    public Boolean roomNameUnique(String roomName, Long roomId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的教室，允许教室名称相同， 返回 false
        //                 其他教室，不允许， 返回 true
        Room room = this.getByName(roomName);
        if (Objects.equals(room.getId(), roomId)) {
            return false;
        }
        return true;
    }

    private Room getByName(String roomName) {
        return this.roomRepository.findByNameAndDeletedFalse(roomName).orElseThrow(() -> new EntityNotFoundException("找不到对应实体"));
    }
}
