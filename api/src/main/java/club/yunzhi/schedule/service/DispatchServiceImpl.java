package club.yunzhi.schedule.service;

import club.yunzhi.schedule.entity.Schedule;
import club.yunzhi.schedule.repository.DispatchRepository;
import org.springframework.stereotype.Service;

@Service
public class DispatchServiceImpl implements DispatchService{
    private final DispatchRepository dispatchRepository;
    public DispatchServiceImpl(DispatchRepository dispatchRepository) {this.dispatchRepository = dispatchRepository;}

    @Override
    public void addBySchedule(Schedule schedule) {
        schedule.getDispatches().forEach(dispatch -> {
            Schedule schedule1 = new Schedule();
            schedule1.setId(schedule.getId());
            dispatch.setSchedule(schedule1);
            this.dispatchRepository.save(dispatch);
        });
    }

    @Override
    public void deleteBySchedule(Schedule schedule) {
        this.dispatchRepository.deleteAll(schedule.getDispatches());
    }
}
