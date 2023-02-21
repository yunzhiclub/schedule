package club.yunzhi.schedule.excel;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;

import javax.validation.ValidationException;
import java.util.Optional;

/**
 * Excel列值
 *
 * @param <T>
 */
public class ExcelCellValue<T> {
  /**
   * 错误消息
   */
  private final String errorMessage;
  /**
   * 列类型
   */
  private final CellType cellType;

  /**
   * 检测方法
   */
  private ExcelCellValueCheckFn<T> excelCellValueCheckFn;

  public ExcelCellValue(String errorMessage, CellType cellType, ExcelCellValueCheckFn<T> excelCellValueCheckFn) {
    this(errorMessage, cellType);
    this.excelCellValueCheckFn = excelCellValueCheckFn;
  }

  public ExcelCellValue(String errorMessage, CellType cellType) {
    this.errorMessage = errorMessage;
    this.cellType = cellType;
  }

  /**
   * 获取单元格数据
   *
   * @param cell 单元格
   * @return
   * @throws ValidationException 校验发生错误时，跑出异常
   */
  public T getValue(Cell cell) throws ValidationException {
    System.out.println(cell.getCellType().toString() + cell.getStringCellValue());
    if (!cell.getCellType().equals(this.cellType)) {
      throw new ValidationException(this.errorMessage);
    }
    T result;
    if (this.cellType.equals(CellType.STRING)) {
      result = (T) cell.getStringCellValue();
    } else if (this.cellType.equals(CellType.NUMERIC)) {
      result = (T) new Double(cell.getNumericCellValue());
    } else {
      throw new RuntimeException("当前仅实现了String以及numeric类型的转换，其它的转换器请自行添加");
    }

    return this.checkDataAndReturn(result);
  }

  /**
   * 校验数据后返回
   *
   * @param data 待返回数据
   * @return
   * @throws ValidationException 校验发生错误时，抛出异常
   */
  public T checkDataAndReturn(T data) throws ValidationException {
    if (null != this.excelCellValueCheckFn) {
      Optional<String> checkResult = this.excelCellValueCheckFn.checkFn(data);
      if (checkResult.isPresent()) {
        throw new ValidationException(checkResult.get());
      }
    }

    return data;
  }
}