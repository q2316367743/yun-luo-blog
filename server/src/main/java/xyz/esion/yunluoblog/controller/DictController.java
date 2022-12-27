package xyz.esion.yunluoblog.controller;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import xyz.esion.yunluoblog.entity.Dict;
import xyz.esion.yunluoblog.global.Result;
import xyz.esion.yunluoblog.param.DictParam;
import xyz.esion.yunluoblog.service.DictService;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author Esion
 * @since 2022/10/25
 */
@RestController
@RequestMapping("/api/dict")
@RequiredArgsConstructor
public class DictController {

    private final DictService dictService;

    @PostMapping("all")
    public Result<Map<String, String>> all() {
        return Result.success(dictService.list().stream()
                .collect(Collectors.toMap(Dict::getDictKey, Dict::getDickValue)));
    }

    @PostMapping("save/one")
    public Result<Void> set(@RequestBody DictParam param) {
        Assert.isFalse(StrUtil.isBlank(param.getKey()), "key不能为空");
        Dict dict = dictService.getOne(new LambdaQueryWrapper<Dict>()
                .eq(Dict::getDictKey, param.getKey()));
        if (dict == null) {
            dict = new Dict();
            // 如果字典不存在
            dict.setCreateBy(StpUtil.getLoginIdAsInt());
            dict.setCreateTime(new Date());
            dict.setUpdateBy(StpUtil.getLoginIdAsInt());
            dict.setUpdateTime(new Date());
            dict.setDictKey(param.getKey());
            dict.setDickValue(Optional.ofNullable(param.getValue()).orElse(""));
            dictService.save(dict);
        } else {
            dict.setUpdateBy(StpUtil.getLoginIdAsInt());
            dict.setUpdateTime(new Date());
            dict.setDictKey(param.getKey());
            dict.setDickValue(Optional.ofNullable(param.getValue()).orElse(""));
            dictService.updateById(dict);
        }
        return Result.success();
    }

    @PostMapping("save/all")
    public Result<Void> save(@RequestBody List<DictParam> params) {
        for (DictParam param : params) {
            this.set(param);
        }
        return Result.success();
    }

}
