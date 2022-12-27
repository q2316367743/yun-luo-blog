package xyz.esion.yunluoblog.param;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2022/10/25
 */
@Data
public class DictParam implements Serializable {

    private static final long serialVersionUID = 1L;

    private String key;

    private String value;

}
