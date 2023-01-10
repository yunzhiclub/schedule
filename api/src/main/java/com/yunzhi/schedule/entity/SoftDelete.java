package com.yunzhi.schedule.entity;

/**
 * 软删除接口
 * 文章：https://www.codedemo.club/spring-data-jpa-soft-delete/
 */
public interface SoftDelete {
  Boolean getDeleted();
}
