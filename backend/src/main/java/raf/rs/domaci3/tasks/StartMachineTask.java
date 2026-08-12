package raf.rs.domaci3.tasks;

import org.springframework.beans.factory.annotation.Autowired;
import raf.rs.domaci3.model.ErrorMessage;
import raf.rs.domaci3.model.Machine;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.model.enums.Status;
import raf.rs.domaci3.repositories.ErrorMessageRepo;
import raf.rs.domaci3.repositories.MachineRepo;
import raf.rs.domaci3.services.UserService;

import java.util.Date;
import java.util.Optional;

public class StartMachineTask implements Runnable{
    private Long machineId;
    private User client;
    private final MachineRepo machineRepo;
    private final ErrorMessageRepo errorMessageRepo;
    private final UserService userService;

    @Autowired
    public StartMachineTask (Long machineId, User client, MachineRepo machineRepo, ErrorMessageRepo errorMessageRepo, UserService userService) {
        this.machineId = machineId;
        this.client = client;
        this.machineRepo = machineRepo;
        this.errorMessageRepo = errorMessageRepo;
        this.userService = userService;
    }

    @Override
    public void run() {
        Optional<User> user = userService.findById(this.client.getId());

        System.out.println("Starting machine with id: " + machineId);

        if(user.isPresent()) {
            User u = user.get();
            Optional<Machine> machine = machineRepo.findById(machineId);

            if(machine.isPresent()) {
                Machine m = machine.get();
                System.out.println("Machine found");
                if(m.getStatus().equals(Status.RUNNING)) {
                    errorMessageRepo.save(new ErrorMessage(new Date(), m.getId(), this.client, "START", "Machine already running"));
                    System.out.println("Error message added to db");
                    return;
                }

                if(m.isOperationActive()) {
                    errorMessageRepo.save(new ErrorMessage(new Date(), m.getId(), this.client, "START", "Machine was undergoing operation"));
                    System.out.println("Error message added to db");
                    return;
                }

                try {
                    m.setOperationActive(true);
                    machineRepo.save(m);
                    System.out.println("Starting machine");
                    Thread.sleep((long) (Math.random() * (15000 - 10000) + 10000));
                } catch (InterruptedException e) {
                    errorMessageRepo.save(new ErrorMessage(new Date(), m.getId(), this.client, "START", "Error while stopping machine"));
                    System.out.println("Error message added to db");
                    throw new RuntimeException(e);
                }
                m = machineRepo.findById(machineId).get();
                m.setStatus(Status.RUNNING);
                m.setOperationActive(false);
                machineRepo.save(m);
                System.out.println("Machine scheduled start successful");
            }
        }
    }
}
