package raf.rs.domaci3.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import raf.rs.domaci3.model.enums.PermissionEnum;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.services.UserService;

import java.util.Optional;

@Component
public class PermissionsUtil {

    private UserService userService;

    @Autowired
    public PermissionsUtil (UserService userService) {
        this.userService = userService;
    }

    public boolean checkPermission (PermissionEnum permissionEnum) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = this.userService.findByEmail(email);

        if (user.isPresent()) {
            User u = user.get();
            switch (permissionEnum) {
                case CAN_READ_USER:
                    return  u.getPermission().getCanReadUser() == 1;
                case CAN_CREATE_USER:
                    return u.getPermission().getCanCreateUser() == 1;
                case CAN_DELETE_USER:
                    return u.getPermission().getCanDeleteUser() == 1;
                case CAN_UPDATE_USER:
                    return u.getPermission().getCanUpdateUser() == 1;
                case CAN_CREATE_MACHINE:
                    return u.getPermission().getCanCreateMachine() == 1;
                case CAN_DESTROY_MACHINE:
                    return u.getPermission().getCanDestroyMachine() == 1;
                case CAN_RESTART_MACHINE:
                    return u.getPermission().getCanRestartMachine() == 1;
                case CAN_SEARCH_MACHINE:
                    return u.getPermission().getCanSearchMachine() == 1;
                case CAN_START_MACHINE:
                    return u.getPermission().getCanStartMachine() == 1;
                case CAN_STOP_MACHINE:
                    return u.getPermission().getCanStopMachine() == 1;
            }
        }
        return false;
    }
}
