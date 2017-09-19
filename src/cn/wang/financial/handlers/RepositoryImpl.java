package cn.wang.financial.handlers;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Repository
public class RepositoryImpl {
    @Autowired
    private SessionFactory sessionFactory;

    public Session getCurrentSession() {
        return this.sessionFactory.openSession();
    }

//    public Person load(Long id) {
//        return (Person)getCurrentSession().load(Person.class,id);
//    }
//
//    public Person get(Long id) {
//        return (Person)getCurrentSession().get(Person.class,id);
//    }
//
//    public List<Person> findAll() {
//        return null;
//    }
//
//    public void persist(Person entity) {
//        getCurrentSession().persist(entity);
//    }
//
//    public Long save(Person entity) {
//        return (Long)getCurrentSession().save(entity);
//    }
//
//    public void saveOrUpdate(Person entity) {
//        getCurrentSession().saveOrUpdate(entity);
//    }
//
//    public void delete(Long id) {
//        Person person = load(id);
//        getCurrentSession().saveOrUpdate(entity);
//    }

    public void flush() {
        getCurrentSession().flush();
    }
}
