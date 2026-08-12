package raf.rs.domaci3.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import raf.rs.domaci3.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    public Optional<User> findUserByEmail(String email);
}
