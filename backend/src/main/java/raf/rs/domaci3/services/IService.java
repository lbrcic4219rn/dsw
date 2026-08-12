package raf.rs.domaci3.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import raf.rs.domaci3.model.User;

import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

public interface IService {
    User save(User user);
    List<User> findAll();
    Optional<User> findById(Long id);
    void delete(Long id);
    Optional<User> findByEmail(String email);
}
