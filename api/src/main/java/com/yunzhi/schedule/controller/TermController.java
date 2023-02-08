package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.entity.vo.StateTerm;
import com.yunzhi.schedule.service.TermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("term")
public class TermController {
    private TermService termService;

    @Autowired
    TermController(TermService termService) {
        this.termService = termService;
    }

    /**
     * 分页接口.
     * @param name     名称
     * @param pageable 分页数据.
     * @return 分页教师
     */
    @GetMapping("/page")
    public Page<Term> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @SortDefault.SortDefaults({@SortDefault(sort = "state", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "id", direction = Sort.Direction.DESC)})
            Pageable pageable) {
        return this.termService.page(name, pageable);
    }

    @GetMapping("termNameUnique")
    public Boolean termNameUnique(@RequestParam String name,
                                  @RequestParam Long termId) {
        System.out.println(name);
        System.out.println(termId);
        try {
            return this.termService.termNameUnique(name, termId);
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    /**
     * 新增学期接口.
     * @param term 学期
     * @return 学期
     */
    @PostMapping
    public Term add(@RequestBody Term term) {
        return this.termService.add(term);
    }

    /**
     * 更新学期
     * @param term   更新后的学期数据
     * @return 学期
     */
    @PostMapping("update/{id}")
    public Term update(@PathVariable Long id,
                          @RequestBody Term term) {
        return this.termService.update(id, term);
    }

    @DeleteMapping("{termId}")
    public void deleteById(@PathVariable Long termId) {
        this.termService.deleteById(termId);
    }
    @GetMapping("{termId}")
    public Term getById(@PathVariable Long termId) {
        return this.termService.getById(termId);
    }

    @GetMapping("active/{termId}")
    public StateTerm active(@PathVariable Long termId) {
        return this.termService.activeTerm(termId);
    }
    @GetMapping("getCurrentTerm")
    public Term getCurrentTerm() {
        return this.termService.getCurrentTerm();
    }

    @GetMapping("getAll")
    public List<Term> getAll() {
        return this.termService.getAll();
    }

}
