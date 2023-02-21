package club.yunzhi.schedule.service;

import club.yunzhi.schedule.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

public interface TeacherService {
    Page<Teacher> page(String name, String phone, Pageable pageable);

    Teacher save(Teacher teacher);

    Teacher getById(Long id);

    Teacher update(Long id, Teacher teacher);

    void deleteById(Long id);

    List<Teacher> getAll();

    Boolean phoneUnique(String phone, Long teacherId);

    void downloadImportTemplate(OutputStream outputStream) throws IOException;


    void importExcel(InputStream inputStream, OutputStream outputStream) throws IOException;
}
