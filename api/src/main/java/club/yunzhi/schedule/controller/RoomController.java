package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.entity.*;
import club.yunzhi.schedule.service.RoomService;
import com.fasterxml.jackson.annotation.JsonView;
import club.yunzhi.schedule.entity.*;
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
    @JsonView(PageJsonView.class)
    public Page<Room> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String capacity,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        return this.roomService.page(name, capacity, pageable);
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
    @JsonView(GetById.class)
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
    public void update(@PathVariable Long id,
                          @RequestBody Room room) {
        this.roomService.update(id, room);
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
    @JsonView(GetAll.class)
    public List<Room> getAll() {
        return this.roomService.getAll();
    }

    @GetMapping("getForRoomDetail/{roomId}")
    @JsonView(GetForRoomDetail.class)
    public Room getForRoomDetail(@PathVariable Long roomId) {
        Room room = this.roomService.getById(roomId);
//        List<Schedule> schedules = new ArrayList<>();
//        room.setDispatches(room.getDispatches().stream().filter(dispatch -> !dispatch.getDeleted()).collect(Collectors.toList()));
//        room.getDispatches().forEach(dispatch -> {
//            if (!schedules.contains(dispatch.getSchedule())) {
//                schedules.add(dispatch.getSchedule());
//            }
//        });
//        schedules.forEach(schedule -> {
//            schedule.setClazzes(schedule.getClazzes().stream().filter(clazz -> !clazz.getDeleted()).collect(Collectors.toList()));
//            if (schedule.getTeacher1().getDeleted()) {
//                schedule.setTeacher1(new Teacher());
//            }
//            if (schedule.getTeacher2().getDeleted()) {
//                schedule.setTeacher2(new Teacher());
//            }
//        });
        return room;
    }

    public interface PageJsonView extends
            Room.IdJsonView,
            Room.NameJsonView,
            Room.CapacityJsonView
    {}
    public interface GetById extends
            Room.IdJsonView,
            Room.NameJsonView,
            Room.CapacityJsonView
    {}
    public interface GetAll extends
            Room.IdJsonView,
            Room.NameJsonView,
            Room.CapacityJsonView
    {}
    public interface GetForRoomDetail extends
            Room.IdJsonView,
            Room.NameJsonView,
            Room.CapacityJsonView,
            Room.Dispatches,
            Dispatch.IdJsonView,
            Dispatch.DayJsonView,
            Dispatch.LessonJsonView,
            Dispatch.WeekJsonView,
            Dispatch.ScheduleJsonView,
            Schedule.IdJsonView,
            Schedule.TermJsonView,
            Term.IdJsonView,
            Schedule.ClazzJsonView,
            Clazz.IdJsonView,
            Clazz.NameJsonView,
            Schedule.Teacher1JsonView,
            Schedule.Teacher2JsonView,
            Teacher.IdJsonView,
            Teacher.NameJsonView,
            Schedule.CourseJsonView,
            Course.IdJsonView,
            Course.NameJsonView
    {}


}
