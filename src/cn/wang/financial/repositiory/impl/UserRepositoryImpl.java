package cn.wang.financial.repositiory.impl;

import cn.wang.financial.entities.User;
import cn.wang.financial.repositiory.UserRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Repository
public class UserRepositoryImpl implements UserRepository{
    @Autowired
    private SessionFactory sessionFactory;

    public Session getCurrentSession() {
        return this.sessionFactory.openSession();
    }

    @Override
    public User get(Integer id) {
        return getCurrentSession().get(User.class,id);
    }

    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public Integer save(User entity) {
        return (Integer)getCurrentSession().save(entity);
    }

    @Override
    public void saveOrUpdate(User entity) {
        getCurrentSession().saveOrUpdate(entity);
    }

    @Override
    public void delete(Integer id) {
        getCurrentSession().saveOrUpdate(get(id));
    }

    @Override
    public void flush() {

    }
}
