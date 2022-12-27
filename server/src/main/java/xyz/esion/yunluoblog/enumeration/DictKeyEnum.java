package xyz.esion.yunluoblog.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * @author Esion
 * @since 2022/10/19
 */
@Getter
@RequiredArgsConstructor
public enum DictKeyEnum {

    FILE_BASE_PATH("file:base_path");

    private final String key;

}
