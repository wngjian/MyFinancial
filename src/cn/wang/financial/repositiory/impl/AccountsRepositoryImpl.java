package cn.wang.financial.repositiory.impl;

import cn.wang.financial.entities.Accounts;
import cn.wang.financial.repositiory.AccountsRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Repository
public class AccountsRepositoryImpl implements AccountsRepository {
    @Autowired
    private SessionFactory sessionFactory;

    public Session getCurrentSession() {
        return this.sessionFactory.openSession();
    }

    @Override
    public Accounts get(Integer id) {
        return getCurrentSession().get(Accounts.class,id);
    }

    @Override
    public List<Accounts> findAll() {
        List list = null;
        try {
            Session session = getCurrentSession();
            Transaction tran = session.beginTransaction();
            Query q = session.createQuery("from Accounts");
            list = q.list();
            tran.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;

    }

    @Override
    public Integer save(Accounts entity) {
        return (Integer) getCurrentSession().save(entity);
    }

    @Override
    public void saveOrUpdate(Accounts entity) {
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
