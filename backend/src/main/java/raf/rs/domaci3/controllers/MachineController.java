package raf.rs.domaci3.controllers;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import raf.rs.domaci3.model.Machine;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.model.enums.PermissionEnum;
import raf.rs.domaci3.model.enums.Status;
import raf.rs.domaci3.services.MachineService;
import raf.rs.domaci3.services.UserService;
import raf.rs.domaci3.util.PermissionsUtil;

import javax.print.attribute.standard.Media;
import javax.swing.text.DateFormatter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("api/machines")
public class MachineController {

    private final MachineService machineService;
    private final UserService userService;
    private final PermissionsUtil permissionsUtil;

    @Autowired
    public MachineController(MachineService machineService, UserService userService, PermissionsUtil permissionsUtil) {
        this.machineService = machineService;
        this.userService = userService;
        this.permissionsUtil = permissionsUtil;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllUserMachines() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userService.findByEmail(username);

        if(user.isPresent())
            return ResponseEntity.ok(machineService.getAllUserMachines());

        return ResponseEntity.status(401).build();
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createMachine(@RequestBody HashMap<String, String> name) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userService.findByEmail(username);


        if(user.isPresent())
            return ResponseEntity.ok(machineService.createMachine(name.get("name")));

        return ResponseEntity.status(401).build();
    }

    @DeleteMapping(value = "/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteMachine(@PathVariable("id") String id) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_DESTROY_MACHINE))
            return ResponseEntity.status(403).build();

        User user = userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).get();

        Optional<Machine> machine = machineService.findById(Long.parseLong(id));
        if (!machine.isPresent()) {
            return ResponseEntity.status(404).build();
        }

        Machine m = machine.get();
        if(!m.getUser().getId().equals(user.getId()))
            return ResponseEntity.status(401).body("Machine not owned");

        if (machineService.isMachineBusy(m.getId())) {
            return ResponseEntity.status(400).body("Machine is under operation");
        }

        if (m.getStatus() == Status.STOPPED) {
            if (!m.isActive()) {
                return ResponseEntity.status(400).body("Machine is already deleted");
            }
            machineService.deleteMachine(Long.parseLong(id));
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(400).body("Machine is not stopped");
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> searchMachine(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") Date dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") Date dateTo
    ) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_SEARCH_MACHINE))
            return ResponseEntity.status(403).build();

        if (status != null) {
            String[] statusArr = status.split(",");
            ArrayList<Status> statuses = new ArrayList<>();
            for (String s : statusArr) {
                statuses.add(Status.valueOf(s));
            }
            return ResponseEntity.ok(machineService.searchMachines(name, statuses, dateFrom, dateTo));
        }
        return ResponseEntity.ok(machineService.searchMachines(name, null, dateFrom, dateTo));
    }

    @PatchMapping(value = "start/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity startMachine(@PathVariable("id") String id) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_START_MACHINE))
            return ResponseEntity.status(403).build();

        if (machineService.isMachineBusy(Long.parseLong(id))) {
            return ResponseEntity.status(409).body("Machine is going through an operation");
        }

        if (machineService.canStartMachine(Long.parseLong(id))) {
            machineService.startMachine(Long.parseLong(id));
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(400).body("Machine is not in a correct state");
    }

    @PatchMapping(value = "stop/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity stopMachine(@PathVariable("id") String id) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_STOP_MACHINE))
            return ResponseEntity.status(403).build();

        if (machineService.isMachineBusy(Long.parseLong(id))) {
            return ResponseEntity.status(409).body("Machine is going through an operation");
        }

        if (machineService.canStopMachine(Long.parseLong(id))) {
            machineService.stopMachine(Long.parseLong(id));
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(400).body("Machine is not in a correct state");
    }

    @PatchMapping(value = "restart/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity restartMachine(@PathVariable("id") String id) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_RESTART_MACHINE))
            return ResponseEntity.status(403).build();

        if (machineService.isMachineBusy(Long.parseLong(id))) {
            return ResponseEntity.status(409).body("Machine is going through an operation");
        }

        if (machineService.canStopMachine(Long.parseLong(id))) {
            machineService.restartMachine(Long.parseLong(id));
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(400).body("Machine is not in a correct state");
    }

    @PatchMapping(value = "/schedule/start/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> scheduleStartMachine(@PathVariable ("id") String id,
                                                 @RequestBody Map<String, String> time) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_START_MACHINE))
            return ResponseEntity.status(403).build();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime dateTime = LocalDateTime.parse(time.get("time"), formatter);

        Optional<Machine> machine = machineService.findById(Long.parseLong(id));

        if (machine.isPresent()) {
            Machine m = machine.get();
            machineService.scheduleMachineStart(m.getId(), dateTime);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }

    @PatchMapping(value = "/schedule/stop/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> scheduleStopMachine(@PathVariable ("id") String id,
                                                  @RequestBody Map<String, String> time) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_STOP_MACHINE))
            return ResponseEntity.status(403).build();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime dateTime = LocalDateTime.parse(time.get("time"), formatter);

        Optional<Machine> machine = machineService.findById(Long.parseLong(id));

        if (machine.isPresent()) {
            Machine m = machine.get();
            machineService.scheduleMachineStop(m.getId(), dateTime);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }

    @PatchMapping(value = "/schedule/restart/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> scheduleRestartMachine(@PathVariable ("id") String id,
                                                 @RequestBody Map<String, String> time) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_RESTART_MACHINE))
            return ResponseEntity.status(403).build();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime dateTime = LocalDateTime.parse(time.get("time"), formatter);

        Optional<Machine> machine = machineService.findById(Long.parseLong(id));

        if (machine.isPresent()) {
            Machine m = machine.get();
            machineService.scheduleMachineRestart(m.getId(), dateTime);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }
}
