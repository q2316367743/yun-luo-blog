package xyz.esion.yunluoblog.param;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2022/10/20
 */
@Data
public class LoginParam implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * TOTP
     */
    private String totp;

}
