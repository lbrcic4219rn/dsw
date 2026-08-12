package raf.rs.domaci3.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import raf.rs.domaci3.model.Machine;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.model.enums.Status;
import raf.rs.domaci3.repositories.ErrorMessageRepo;
import raf.rs.domaci3.repositories.MachineRepo;
import raf.rs.domaci3.repositories.UserRepo;
import raf.rs.domaci3.tasks.RestartMachine;
import raf.rs.domaci3.tasks.StartMachineTask;
import raf.rs.domaci3.tasks.StopMachineTask;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;

@Service
public class MachineService {
    private final TaskScheduler taskScheduler = new ConcurrentTaskScheduler(Executors.newScheduledThreadPool(10));

    private final MachineRepo machineRepo;
    private final UserService userService;
    private final ErrorMessageRepo errorMessageRepo;

    @Autowired
    public MachineService(MachineRepo machineRepo, UserService userService, ErrorMessageRepo errorMessageRepo) {
        this.machineRepo = machineRepo;
        this.userService = userService;
        this.errorMessageRepo = errorMessageRepo;
    }

    public List<Machine> getAllUserMachines() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userService.findByEmail(username);

        if(user.isPresent()) {
            User u = user.get();
            return machineRepo.findByUserIdAndActive(u.getId(), true);
        }
        return new ArrayList<Machine>();
    }

    public Optional<Machine> findById(Long id) {
        return machineRepo.findById(id);
    }

    public Machine createMachine(String name) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = this.userService.findByEmail(username);

        if(user.isPresent()) {
            User u = user.get();
            Machine machine = new Machine();
            machine.setUser(u);
            machine.setStatus(Status.STOPPED);
            machine.setActive(true);
            machine.setName(name);
            machine.setCreatedAt(new Date());
            machine.setOperationActive(false);
            return machineRepo.save(machine);
        }
        return null;
    }

    public boolean deleteMachine(Long id){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = this.userService.findByEmail(username);

        if(user.isPresent()) {
            User u = user.get();
            Optional<Machine> machine = machineRepo.findById(id);
            if(machine.isPresent()){
                Machine m = machine.get();
                if(m.getUser().getId().equals(u.getId())){
                    m.setActive(false);
                    machineRepo.save(m);
                    return true;
                }
                return false;
            }
            return false;
        }
        return false;
    }

    public List<Machine> searchMachines (String name, List<Status> statusList, Date dateFrom, Date dateTo) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userService.findByEmail(username);
        if (user.isPresent()) {
            User u = user.get();

            if ((dateFrom != null && dateTo == null) || (dateFrom == null && dateTo != null))
                return new ArrayList<>();

            if (name != null && statusList != null && dateFrom != null && dateTo != null)
                return machineRepo.findByUserIdAndNameContainingAndStatusInAndCreatedAtBetweenAndActive(u.getId(), name, statusList, dateFrom, dateTo, true);

            if (name != null && statusList == null && dateFrom == null && dateTo == null)
                return machineRepo.findByUserIdAndNameContainingAndActive(u.getId(), name, true);

            if (name == null && statusList != null && dateFrom == null && dateTo == null)
                return machineRepo.findByUserIdAndStatusInAndActive(u.getId(), statusList, true);

            if (name != null && statusList != null && dateFrom == null && dateTo == null)
                return machineRepo.findByUserIdAndNameContainingAndStatusInAndActive(u.getId(), name, statusList, true);

            if (name != null && statusList == null && dateFrom != null && dateTo != null)
                return machineRepo.findByUserIdAndNameContainingAndCreatedAtBetweenAndActive(u.getId(), name, dateFrom, dateTo, true);

            if (name == null && statusList != null && dateFrom != null && dateTo != null)
                return machineRepo.findByUserIdAndStatusInAndCreatedAtBetweenAndActive(u.getId(), statusList, dateFrom, dateTo, true);

            if (name == null && statusList == null && dateFrom != null && dateTo != null)
                return machineRepo.findByUserIdAndCreatedAtBetweenAndActive(u.getId(), dateFrom, dateTo, true);

            if (name == null && statusList == null && dateFrom == null && dateTo == null)
                return machineRepo.findByUserIdAndActive(u.getId(), true);

        }
        return new ArrayList<>();
    }

    @Async
    public void startMachine (Long id) {
        Optional<Machine> machine = machineRepo.findById(id);

        if(machine.isPresent()) {
            Machine m = machine.get();

            if(m.getStatus().equals(Status.RUNNING))
                return;

            m.setOperationActive(true);
            machineRepo.save(m);
            try {
                Thread.sleep((long) (Math.random() * (15 - 10) + 10) * 1000);
                m = machineRepo.findById(id).get();
                m.setStatus(Status.RUNNING);
                m.setOperationActive(false);
                machineRepo.save(m);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

        }
    }

    @Async
    public void stopMachine (Long id) {
        Optional<Machine> machine = machineRepo.findById(id);

        if(machine.isPresent()) {
            Machine m = machine.get();

            if(m.getStatus().equals(Status.STOPPED))
                return;

            m.setOperationActive(true);
            machineRepo.save(m);
            try {
                Thread.sleep((long) (Math.random() * (15 - 10) + 10) * 1000);
                m = machineRepo.findById(id).get();
                m.setStatus(Status.STOPPED);
                m.setOperationActive(false);
                machineRepo.save(m);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

        }
    }

    @Async
    public void restartMachine (Long id) {
        Optional<Machine> machine = machineRepo.findById(id);

        if(machine.isPresent()) {
            Machine m = machine.get();

            if(m.getStatus().equals(Status.STOPPED))
                return;

            m.setOperationActive(true);
            machineRepo.save(m);
            try {
                Thread.sleep((long) (Math.random() * (15 - 10) + 10) * 1000);
                m = machineRepo.findById(id).get();
                m.setStatus(Status.STOPPED);
                machineRepo.save(m);
                Thread.sleep((long) (Math.random() * (15 - 10) + 10) * 1000);
                m = machineRepo.findById(id).get();
                m.setStatus(Status.RUNNING);
                m.setOperationActive(false);
                machineRepo.save(m);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public boolean canStartMachine (Long id) {
        Optional<Machine> m = machineRepo.findById(id);

        if(m.isPresent()){
            Machine machine = m.get();
            if(machine.getStatus().equals(Status.STOPPED)) {
                return true;
            }
        }
        return false;
    }

    public boolean canStopMachine (Long id) {
        Optional<Machine> m = machineRepo.findById(id);

        if(m.isPresent()){
            Machine machine = m.get();
            if(machine.getStatus().equals(Status.RUNNING)) {
                return true;
            }
        }
        return false;
    }


    public boolean isMachineBusy (Long id) {
        Optional<Machine> m = machineRepo.findById(id);
        if(m.isPresent()) {
            Machine machine = m.get();
            if(machine.isOperationActive()) {
                return true;
            }
        }
        return false;
    }

    public void scheduleMachineStop(Long id, LocalDateTime dateTime) {
        Optional<Machine> machine = machineRepo.findById(id);
        if (machine.isPresent()) {
            Optional<User> u = userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
            User user = u.get();

            Machine m = machine.get();
            Date scheduleDate = Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());

            taskScheduler.schedule(
                    new StopMachineTask(m.getId(), user, machineRepo, errorMessageRepo, userService),
                    scheduleDate);
        }
    }

    public void scheduleMachineStart(Long id, LocalDateTime dateTime) {
        Optional<Machine> machine = machineRepo.findById(id);
        if (machine.isPresent()) {
            Optional<User> u = userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
            User user = u.get();

            Machine m = machine.get();
            Date scheduleDate = Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());

            taskScheduler.schedule(
                    new StartMachineTask(m.getId(), user, machineRepo, errorMessageRepo, userService),
                    scheduleDate);
        }
    }

    public void scheduleMachineRestart(Long id, LocalDateTime dateTime) {
        Optional<Machine> machine = machineRepo.findById(id);
        if (machine.isPresent()) {
            Optional<User> u = userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
            User user = u.get();

            Machine m = machine.get();
            Date scheduleDate = Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());

            taskScheduler.schedule(
                    new RestartMachine(m.getId(), user, machineRepo, errorMessageRepo, userService),
                    scheduleDate);
        }
    }
}
