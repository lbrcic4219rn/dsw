package raf.rs.domaci3.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import raf.rs.domaci3.model.Machine;
import raf.rs.domaci3.model.enums.Status;

import java.util.Date;
import java.util.List;

public interface MachineRepo extends JpaRepository<Machine, Long> {

    List<Machine> findByUserIdAndActive(Long userId, boolean active);
    List<Machine> findByUserIdAndNameContainingAndStatusInAndCreatedAtBetweenAndActive(Long userId, String name, List<Status> statusList, Date dateFrom, Date dateTo, boolean active);
    List<Machine> findByUserIdAndNameContainingAndActive(Long userId, String name, boolean active);
    List<Machine> findByUserIdAndStatusInAndActive(Long userId, List<Status> statusList, boolean active);
    List<Machine> findByUserIdAndNameContainingAndStatusInAndActive(Long userId, String name, List<Status> statusList, boolean active);
    List<Machine> findByUserIdAndNameContainingAndCreatedAtBetweenAndActive(Long userId, String name, Date dateFrom, Date dateTo, boolean active);
    List<Machine> findByUserIdAndStatusInAndCreatedAtBetweenAndActive(Long userId, List<Status> statusList, Date dateFrom, Date dateTo, boolean active);
    List<Machine> findByUserIdAndCreatedAtBetweenAndActive(Long userId, Date dateFrom, Date dateTo, boolean active);
}
