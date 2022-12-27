package xyz.esion.yunluoblog.controller;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import xyz.esion.yunluoblog.global.Result;
import xyz.esion.yunluoblog.param.LoginParam;
import xyz.esion.yunluoblog.propertity.YunLuoBlogProperty;
import xyz.esion.yunluoblog.view.LoginView;

/**
 * @author Esion
 * @since 2022/10/20
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final YunLuoBlogProperty yunLuoBlogProperty;

    @PostMapping("login")
    public Result<LoginView> login(@RequestBody LoginParam param) {
        Assert.isFalse(StrUtil.isBlank(param.getUsername()), "用户名不能为空");
        Assert.isFalse(StrUtil.isBlank(param.getPassword()), "密码不能为空");
        if (yunLuoBlogProperty.getUsername().equals(param.getUsername()) &&
                yunLuoBlogProperty.getPassword().equals(param.getUsername())) {
            StpUtil.login(yunLuoBlogProperty.getUsername());
            // 最后的结果
            return Result.success(LoginView.builder()
                    .login(true)
                    .token(StpUtil.getTokenValue())
                    .build());
        }
        return Result.success(LoginView.builder()
                .login(false)
                .build());
    }

    @GetMapping("logout")
    public Result<Void> logout() {
        StpUtil.logout();
        return Result.success();
    }

}
