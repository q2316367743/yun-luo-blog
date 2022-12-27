package xyz.esion.yunluoblog.config;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.json.JSONUtil;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import xyz.esion.yunluoblog.enumeration.ResultCodeEnum;
import xyz.esion.yunluoblog.global.Result;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Esion
 * @since 2022/9/25
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowCredentials(true)
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .exposedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
                    @Override
                    public boolean preHandle(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) throws Exception {
                        if (request.getMethod().equals("OPTIONS")) {
                            return true;
                        }
                        if (StpUtil.isLogin()) {
                            return true;
                        } else {
                            // 未登录
                            response.setContentType("application/json");
                            response.setCharacterEncoding("utf-8");
                            response.getWriter().print(JSONUtil.toJsonStr(Result.error(ResultCodeEnum.AUTH_ERROR)));
                            return false;
                        }
                    }
                }).addPathPatterns("/api/file/**", "/api/dict/**")
                .excludePathPatterns("/api/file/read");
    }
}
