package com.yunzhi.schedule.excel;

import java.util.Optional;

public interface ExcelCellValueCheckFn<T> {
  Optional<String> checkFn(T value);
}
