package xyz.esion.yunluoblog.controller;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import xyz.esion.yunluoblog.global.Result;

import java.io.IOException;

/**
 * @author Esion
 * @since 2022/9/27
 */
@RestControllerAdvice
public class ExceptionController {

    @ExceptionHandler(IllegalArgumentException.class)
    public Result<Void> illegalArgumentException(IllegalArgumentException exception) {
        return Result.error(exception.getMessage());
    }

    @ExceptionHandler(IOException.class)
    public Result<Void> ioException() {
        return Result.error("文件IO异常");
    }

}
