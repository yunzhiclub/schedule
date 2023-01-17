package com.yunzhi.schedule.service;

import com.yunzhi.schedule.Utils;
import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.excel.Excel;
import com.yunzhi.schedule.excel.ExcelCellValue;
import com.yunzhi.schedule.repository.TeacherRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TeacherServiceImpl implements TeacherService{
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final TeacherRepository teacherRepository;
    private final UserService userService;

    public TeacherServiceImpl(TeacherRepository teacherRepository,
                              UserService userService) {
        this.teacherRepository = teacherRepository;
        this.userService = userService;
    }

    @Override
    public Page<Teacher> page(String name, String phone, Pageable pageable) {
        return this.teacherRepository.findAll(name, phone, pageable);
    }

    @Override
    public Teacher save(Teacher teacher) {
        Assert.notNull(teacher.getName(), "名称不能为空");
        Assert.notNull(teacher.getSex(), "性别不能为空");
        Assert.notNull(teacher.getPhone(), "手机号不能为空");
        return this.teacherRepository.save(teacher);
    }

    @Override
    public Teacher getById(Long id) {
        return this.teacherRepository.findById(id).get();
    }

    @Override
    public Teacher update(Long id, Teacher teacher) {
        Assert.notNull(teacher.getName(), "name不能为null");
        Assert.notNull(teacher.getSex(), "sex不能为null");
        Assert.notNull(teacher.getPhone(), "phone不能为null");
        Teacher OldTeacher = this.getById(id);
        OldTeacher.setName(teacher.getName());
        OldTeacher.setSex(teacher.getSex());
        OldTeacher.setPhone(teacher.getPhone());
        return this.teacherRepository.save(OldTeacher);
    }

    @Override
    public void deleteById(Long id) {
        this.teacherRepository.deleteById(id);
    }

    @Override
    public List<Teacher> getAll() {
        return (List<Teacher>) this.teacherRepository.findAll();
    }

    @Override
    public Boolean phoneUnique(String phone, Long teacherId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的教师，允许手机号相同， 返回 false
        //                 其他教师，不允许， 返回 true
        Teacher teacher = this.getByPhone(phone);
        if (Objects.equals(teacher.getId(), teacherId)) {
            return false;
        }
        return true;
    }

    @Override
    public void downloadImportTemplate(OutputStream outputStream) throws IOException {
        assert outputStream != null;
        Excel excel = new Excel("教师导入模板");
        excel.append("序号")
                .append("姓名")
                .append("手机号")
                .append("性别")
                .wrap();
        excel.append(1)
                .append("张三")
                .append("13920618851")
                .append("男")
                .wrap();
        excel.append(2)
                .append("李四")
                .append("18502205022")
                .append("男")
                .wrap();
        excel.writeAndClose(outputStream);
    }

    @Override
    public void importExcel(InputStream inputStream, OutputStream outputStream) throws IOException {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            // 跳过首行
            if (row.getRowNum() == 0 || row.getLastCellNum() <= 1) {
                logger.debug("跳过首行、空行");
                continue;
            }

            String result = "成功";
            try {
                this.logger.debug("将excel行转换为teacher，并捕获可能产生的错误");
                Teacher teacher = this.getTeacherByRow(row);
                this.save(teacher);
            } catch (ValidationException e) {
                result = e.getMessage();
            } catch (Exception e) {
                result = "系统异常：" + e.getMessage();
            }

            this.logger.debug("将最终的结果添加到最后一列");
            Cell cell = row.getCell(3);
            if (cell == null) {
                cell = row.createCell(3);
            }
            cell.setCellValue(result);
        }

        this.logger.debug("输出EXCEL");
        workbook.write(outputStream);
    }

    public Teacher getTeacherByRow(Row row) throws javax.validation.ValidationException {
        Teacher teacher = new Teacher();
        for (Cell cell : row) {
            switch (cell.getColumnIndex()) {
                case 1:
                    teacher.setName(new ExcelCellValue<String>("姓名格式不是文本", CellType.STRING, name -> {
                        if (name.trim().isEmpty()) {
                            return Optional.of("姓名不能为空");
                        }
                        return Optional.empty();
                    }).getValue(cell).trim());
                    break;
                case 2:
                    teacher.setPhone(new ExcelCellValue<String>("手机号格式不是文本", CellType.STRING, phone -> {
                        if (phone.trim().isEmpty()) {
                            return Optional.of("手机号不能为空");
                        } else if (!Utils.isMobile(phone)) {
                            return Optional.of("输入的手机号为非法的手机号");
                        } else if (this.teacherRepository.findByPhoneAndDeletedFalse(phone).isPresent()) {
                            return Optional.of("该用户名已被占用");
                        }
                        return Optional.empty();
                    }).getValue(cell).trim());
                    break;
                case 3:
                    teacher.setSex(Objects.equals(new ExcelCellValue<String>("性别格式不是文本", CellType.STRING, sex -> {
                        if (sex == null) {
                            return Optional.of("性别不能为空");
                        }
                        return Optional.empty();
                    }).getValue(cell), "男"));
                    break;
                default:
                    break;
            }
        }
        return teacher;
    }

    private Teacher getByPhone(String sno) {
        return this.teacherRepository.findByPhoneAndDeletedFalse(sno).orElseThrow(() -> new EntityNotFoundException("找不到对应实体"));
    }
}
