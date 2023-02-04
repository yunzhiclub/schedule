package com.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@SQLDelete(sql = "update `room` set deleted = 1 where id = ?")
public class Room implements SoftDelete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    @JsonView(IdJsonView.class)
    private Long id;

    @ApiModelProperty("名称")
    @JsonView(NameJsonView.class)
    private String name;

    @ApiModelProperty("容量")
    @JsonView(CapacityJsonView.class)
    private String capacity;

    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;

    @ApiModelProperty("调度")
    @ManyToMany(mappedBy = "rooms")
    @JsonView(Dispatches.class)
    private List<Dispatch> dispatches = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCapacity() {
        return capacity;
    }

    public void setCapacity(String capacity) {
        this.capacity = capacity;
    }
    @Override
    public Boolean getDeleted() {
        return this.deleted;
    }

    private void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public List<Dispatch> getDispatches() {
        return dispatches;
    }

    public void setDispatches(List<Dispatch> dispatches) {
        this.dispatches = dispatches;
    }


    public interface IdJsonView {}
    public interface NameJsonView {}
    public interface CapacityJsonView {}
    public interface Dispatches {}
}
