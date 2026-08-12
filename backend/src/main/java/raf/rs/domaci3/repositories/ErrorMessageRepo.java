package raf.rs.domaci3.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import raf.rs.domaci3.model.ErrorMessage;

import java.util.List;

public interface ErrorMessageRepo extends JpaRepository<ErrorMessage, Long> {
    List<ErrorMessage> findByUserId(Long userId);
}
