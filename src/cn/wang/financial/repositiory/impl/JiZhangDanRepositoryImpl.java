package cn.wang.financial.repositiory.impl;

import cn.wang.financial.entities.JiZhangDan;
import cn.wang.financial.repositiory.JiZhangDanRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Repository
public class JiZhangDanRepositoryImpl implements JiZhangDanRepository {
    @Autowired
    private SessionFactory sessionFactory;

    public Session getCurrentSession() {
        return this.sessionFactory.openSession();
    }

    @Override
    public JiZhangDan get(Integer id) {
        return getCurrentSession().get(JiZhangDan.class, id);
    }

    @Override
    public List<JiZhangDan> findAll() {
        return null;
    }

    @Override
    public Integer save(JiZhangDan entity) {
        return (Integer) getCurrentSession().save(entity);
    }

    @Override
    public void saveOrUpdate(JiZhangDan entity) {
        getCurrentSession().saveOrUpdate(entity);
    }

    @Override
    public void delete(Integer id) {
        getCurrentSession().saveOrUpdate(get(id));
    }

    @Override
    public void flush() {
        getCurrentSession().flush();
    }
}
