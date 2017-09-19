package cn.wang.financial.repositiory;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
public interface DomainRepository<T,PK extends Serializable> {
    T get(PK id);

    List<T> findAll();

    PK save(T entity);

    void saveOrUpdate(T entity);

    void delete(PK id);

    void flush();
}
