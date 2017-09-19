package cn.wang.financial.service.impl;

import cn.wang.financial.entities.KeMu;
import cn.wang.financial.repositiory.KeMuRepository;
import cn.wang.financial.service.KeMuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Service
public class KeMuServiceImpl implements KeMuService {
    @Autowired
    private KeMuRepository keMuRepository;

    @Override
    public KeMu get(Integer id) {
        return keMuRepository.get(id);
    }

    @Override
    public List<KeMu> findAll() {
        return keMuRepository.findAll();
    }

    @Override
    public Integer save(KeMu entity) {
        return keMuRepository.save(entity);
    }

    @Override
    public void saveOrUpdate(KeMu entity) {
        keMuRepository.saveOrUpdate(entity);
    }

    @Override
    public void delete(Integer id) {
        keMuRepository.delete(id);
    }

    @Override
    public void flush() {
        keMuRepository.flush();
    }
}
