package club.yunzhi.schedule.excel;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.OutputStream;

/**
 * EXCEL表格.
 */
public class Excel {
  private final XSSFWorkbook workbook;
  private final CellStyle cellStyle;
  private final Sheet sheet;
  private OutputStream outputStream;
  private Row currentRow;
  private Cell currentCell;
  private int colNumber = 0;
  private int rowNumber = 0;

  public Excel(String sheetTitle) {
    this.workbook = new XSSFWorkbook();
    this.cellStyle = this.getCellStyle();
    this.sheet = this.workbook.createSheet(sheetTitle);
    this.currentRow = this.sheet.createRow(rowNumber);
    this.currentCell = this.currentRow.createCell(colNumber);
  }

  public Excel(String title, OutputStream outputStream) {
    this(title);
    this.outputStream = outputStream;
  }

  /**
   * 获取表格样式
   *
   * @return 单元格样式
   */
  public CellStyle getCellStyle() {
    CellStyle cellStyle = workbook.createCellStyle();
    XSSFFont font = workbook.createFont();
    font.setFontName("Songti SC");
    font.setFontHeightInPoints((short) 14);
    cellStyle.setFont(font);
    return cellStyle;
  }

  /**
   * 换行.
   */
  public Excel wrap() {
    this.rowNumber++;
    this.colNumber = 0;
    this.currentRow = this.sheet.createRow(this.rowNumber);
    this.currentCell = this.createCell(this.colNumber);
    return this;
  }

  /**
   * 写数据
   *
   * @param value 值
   * @return 当前表格
   */
  public Excel append(Object value) {
    if (value instanceof Integer) {
      this.currentCell.setCellValue((Integer) value);
    } else if (value instanceof Boolean) {
      this.currentCell.setCellValue((Boolean) value);
    } else if (value instanceof Long) {
      this.currentCell.setCellValue((Long) value);
    } else if (value instanceof Double) {
      this.currentCell.setCellValue((Double) value);
    } else {
      this.currentCell.setCellValue((String) value);
    }
    sheet.autoSizeColumn(this.colNumber);
    this.gotoNextCell();
    return this;
  }

  /**
   * 跳转到下一单元格.
   */
  public void gotoNextCell() {
    this.colNumber++;
    this.currentCell = this.createCell(this.colNumber);
  }

  /**
   * 创建单元格
   *
   * @param col 列号
   * @return 列
   */
  public Cell createCell(int col) {
    Cell Cell = this.currentRow.createCell(col);
    Cell.setCellStyle(this.cellStyle);
    return Cell;
  }

  public void write() throws IOException {
    this.write(this.outputStream);
  }

  public void write(OutputStream outputStream) throws IOException {
    workbook.write(outputStream);
  }

  /**
   * 向输出流中写数据.
   * 写完数据后，关闭workbook，关闭输出流。如果该逻辑不符合实际需求，则需要重写。
   *
   * @param outputStream 输出流
   */
  public void writeAndClose(OutputStream outputStream) throws IOException {
    workbook.write(outputStream);
    this.close(outputStream);
  }

  public void writeAndClose() throws IOException {
    this.writeAndClose(this.outputStream);
  }

  public void close(OutputStream outputStream) throws IOException {
    this.workbook.close();
    outputStream.close();
  }

  public void close() throws IOException {
    this.workbook.close();
    this.outputStream.close();
  }
}
