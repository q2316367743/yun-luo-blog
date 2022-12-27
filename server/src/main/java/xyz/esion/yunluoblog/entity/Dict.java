package xyz.esion.yunluoblog.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 * @TableName dict
 */
@TableName(value = "dict")
@Data
public class Dict implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Integer id;

    /**
     *
     */
    private Integer isDelete;

    /**
     *
     */
    @TableField(fill = FieldFill.INSERT)
    private Integer createBy;

    /**
     *
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    /**
     *
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Integer updateBy;

    /**
     *
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    /**
     *
     */
    private String dictKey;

    /**
     *
     */
    private String dickValue;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}