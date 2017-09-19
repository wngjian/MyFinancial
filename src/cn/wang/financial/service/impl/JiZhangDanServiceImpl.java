package cn.wang.financial.service.impl;

import cn.wang.financial.entities.JiZhangDan;
import cn.wang.financial.repositiory.JiZhangDanRepository;
import cn.wang.financial.service.JiZhangDanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Service
public class JiZhangDanServiceImpl implements JiZhangDanService {
    @Autowired
    private JiZhangDanRepository jiZhangDanRepository;

    @Override
    public JiZhangDan get(Integer id) {
        return jiZhangDanRepository.get(id);
    }

    @Override
    public List<JiZhangDan> findAll() {
        return jiZhangDanRepository.findAll();
    }

    @Override
    public Integer save(JiZhangDan entity) {
        return jiZhangDanRepository.save(entity);
    }

    @Override
    public void saveOrUpdate(JiZhangDan entity) {
        jiZhangDanRepository.saveOrUpdate(entity);
    }

    @Override
    public void delete(Integer id) {
        jiZhangDanRepository.delete(id);
    }

    @Override
    public void flush() {
        jiZhangDanRepository.flush();
    }
}
