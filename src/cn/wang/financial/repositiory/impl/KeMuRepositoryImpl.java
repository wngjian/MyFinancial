package cn.wang.financial.repositiory.impl;

import cn.wang.financial.entities.KeMu;
import cn.wang.financial.repositiory.KeMuRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Repository
public class KeMuRepositoryImpl implements KeMuRepository {
    @Autowired
    private SessionFactory sessionFactory;

    public Session getCurrentSession() {
        return this.sessionFactory.openSession();
    }

    @Override
    public KeMu get(Integer id) {
        return getCurrentSession().get(KeMu.class, id);
    }

    @Override
    public List<KeMu> findAll() {
        return null;
    }

    @Override
    public Integer save(KeMu entity) {
        return (Integer) getCurrentSession().save(entity);
    }

    @Override
    public void saveOrUpdate(KeMu entity) {
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
