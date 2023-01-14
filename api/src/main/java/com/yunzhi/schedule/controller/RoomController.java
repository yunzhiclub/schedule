package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.Room;
import com.yunzhi.schedule.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("room")
public class RoomController {
    private RoomService roomService;

    @Autowired
    RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    /**
     * 分页接口.
     * @param name     名称
     * @param capacity 容量.
     * @return 分页教室
     */
    @GetMapping("/page")
    public Page<Room> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String capacity,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        Page<Room> page = this.roomService.page(name, capacity, pageable);
        return page;
    }

    /**
     * 新增教室
     * @param room   新增教室数据
     * @return 教室
     */
    @PostMapping("add")
    @ResponseStatus(HttpStatus.CREATED)
    public Room save(@RequestBody Room room) {
        return this.roomService.save(room);
    }

    /**
     * 通过id获取教室
     * @param id   教室id
     * @return 教室
     */
    @GetMapping("getById/{id}")
    public Room getById(@PathVariable Long id) {
        return this.roomService.getById(id);
    }

    /**
     * 更新教室
     * @param room   更新后的教室数据
     * @return 教室
     */
    @PostMapping("update/{id}")
    public Room update(@PathVariable Long id,
                          @RequestBody Room room) {
        return this.roomService.update(id, room);
    }

    /**
     * 删除教室
     * @param id   删除教室的id
     * @return 教室
     */
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        this.roomService.deleteById(id);
    }

    /**
     * 教室名称唯一性验证
     * @return     boolean
     */
    @GetMapping("roomNameUnique")
    public Boolean roomNameUnique(@RequestParam String roomName,
                             @RequestParam Long roomId) {

        try {

            return this.roomService.roomNameUnique(roomName, roomId);
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    /**
     * 获取所有教室
     */
    @GetMapping("getAll")
    public List<Room> getAll() {
        return this.roomService.getAll();
    }
}
