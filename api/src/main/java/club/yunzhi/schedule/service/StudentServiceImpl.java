package club.yunzhi.schedule.service;

import club.yunzhi.schedule.entity.Student;
import club.yunzhi.schedule.excel.Excel;
import club.yunzhi.schedule.excel.ExcelCellValue;
import club.yunzhi.schedule.repository.ClazzRepository;
import club.yunzhi.schedule.repository.StudentRepository;
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
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    StudentRepository studentRepository;
    ClazzRepository clazzRepository;

    StudentServiceImpl(StudentRepository studentRepository,
                       ClazzRepository clazzRepository) {
        this.studentRepository = studentRepository;
        this.clazzRepository = clazzRepository;
    }

    @Override
    public Student add(Student student) {
        Assert.notEmpty(Arrays.asList(
                student.getName(), student.getSno(), student.getClazz(), student.getSex()
        ), "发生校验错误，请检查输入字段");
        return this.studentRepository.save(student);
    }

    @Override
    public Student getByName(String name) {
        return this.studentRepository.findByNameAndDeletedFalse(name).orElseThrow(() -> new EntityNotFoundException("找不到对应实体"));
    }

    @Override
    public Boolean studentNameUnique(String name, Long studentId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的学生，允许名称相同， 返回 false
        //                 其他学生，不允许， 返回 true
        Student student = this.getByName(name);
        if (Objects.equals(student.getId(), studentId)) {
            return false;
        }
        return true;
    }

    @Override
    public Boolean snoUnique(String sno, Long studentId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的学生，允许学号相同， 返回 false
        //                 其他学生，不允许， 返回 true
        Student student = this.getBySno(sno);
        if (Objects.equals(student.getId(), studentId)) {
            return false;
        }
        return true;
    }

    private Student getBySno(String sno) {
        return this.studentRepository.findBySnoAndDeletedFalse(sno).orElseThrow(() -> new EntityNotFoundException("找不到对应实体"));
    }

    @Override
    public void deleteById(Long studentId) {
        this.studentRepository.deleteById(studentId);
    }

    @Override
    public Student getById(Long studentId) {
        return this.studentRepository.findById(studentId).orElseThrow(() -> new EntityNotFoundException("未找到相关实体"));
    }

    @Override
    public Student update(Long id, Student student) {
        Assert.notNull(student.getName(), "name不能为null");
        Assert.notNull(student.getSno(), "sno不能为null");
        Assert.notNull(student.getClazz(), "clazz不能为null");
        Student OldStudent = this.getById(id);
        OldStudent.setName(student.getName());
        OldStudent.setSex(student.getSex());
        OldStudent.setSno(student.getSno());
        OldStudent.setClazz(student.getClazz());
        return this.studentRepository.save(OldStudent);
    }

    @Override
    public void downloadImportTemplate(OutputStream outputStream) throws IOException {
        assert outputStream != null;
        Excel excel = new Excel("学生导入模板");
        excel.append("序号")
                .append("姓名")
                .append("学号")
                .append("性别")
                .append("班级名称")
                .wrap();
        excel.append(1)
                .append("张三")
                .append("230001")
                .append("男")
                .append("计科221")
                .wrap();
        excel.append(2)
                .append("李四")
                .append("230002")
                .append("女")
                .append("软件221")
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
                this.logger.debug("将excel行转换为student，并捕获可能产生的错误");
                Student student = this.getStudentByRow(row);
                this.add(student);
            } catch (ValidationException e) {
                result = e.getMessage();
            } catch (Exception e) {
                result = "系统异常：" + e.getMessage();
            }

            this.logger.debug("将最终的结果添加到最后一列");
            Cell cell = row.getCell(5);
            if (cell == null) {
                cell = row.createCell(5);
            }
            cell.setCellValue(result);
        }

        this.logger.debug("输出EXCEL");
        workbook.write(outputStream);
    }

    @Override
    public Page<Student> page(Long clazzId, String clazzName, String name, String sno, Pageable pageable) {
        return this.studentRepository.findAllByNameAndSnoAndClazzId(clazzId, clazzName, name, sno, pageable);
    }

    public Student getStudentByRow(Row row) throws javax.validation.ValidationException {
        Student student = new Student();
        for (Cell cell : row) {
            switch (cell.getColumnIndex()) {
                case 1:
                    student.setName(new ExcelCellValue<String>("姓名格式不是文本", CellType.STRING, name -> {
                        if (name.trim().isEmpty()) {
                            return Optional.of("姓名不能为空");
                        }
                        return Optional.empty();
                    }).getValue(cell).trim());
                    break;
                case 2:
                    student.setSno(new ExcelCellValue<String>("学号格式不是文本", CellType.STRING, sno -> {
                        if (sno.trim().isEmpty()) {
                            return Optional.of("学号不能为空");
                        } else if (this.studentRepository.findBySnoAndDeletedFalse(sno).isPresent()) {
                            return Optional.of("该学号已被占用");
                        }
                        return Optional.empty();
                    }).getValue(cell).trim());
                    break;
                case 3:
                    student.setSex(Objects.equals(new ExcelCellValue<String>("性别格式不是文本", CellType.STRING, sex -> {
                        if (sex == null) {
                            return Optional.of("性别不能为空");
                        }
                        return Optional.empty();
                    }).getValue(cell), "男"));
                    break;
                case 4:
                    student.setClazz(this.clazzRepository.findByNameAndDeletedFalse(
                    new ExcelCellValue<String>("班级名称格式不是文本", CellType.STRING, sno -> {
                        if (sno.trim().isEmpty()) {
                            return Optional.of("班级名称不能为空");
                        } else if (!this.clazzRepository.findByNameAndDeletedFalse(sno).isPresent()) {
                            return Optional.of("班级不存在");
                        }
                        return Optional.empty();
                    }).getValue(cell).trim()).get());
                default:
                    break;
            }
        }
        return student;
    }
}
