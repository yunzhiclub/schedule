package club.yunzhi.schedule.service;

import club.yunzhi.schedule.entity.Schedule;

public interface DispatchService {

    void addBySchedule(Schedule schedule);

    void deleteBySchedule(Schedule schedule);
}
