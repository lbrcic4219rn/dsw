package raf.rs.domaci3.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import raf.rs.domaci3.model.enums.PermissionEnum;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.requests.CreateUserRequest;
import raf.rs.domaci3.responses.UserResponse;
import raf.rs.domaci3.services.UserService;
import raf.rs.domaci3.util.PermissionsUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final PermissionsUtil permissionsUtil;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder, PermissionsUtil permissionsUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.permissionsUtil = permissionsUtil;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_READ_USER))
            return ResponseEntity.status(403).build();

        List<User> foundUsers = userService.findAll();
        List<UserResponse> resp = new ArrayList<>();
        for(User u: foundUsers){
            resp.add(new UserResponse(u.getId(), u.getName(), u.getSurname(), u.getEmail(), u.getPermission()));
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest user) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_CREATE_USER))
            return ResponseEntity.status(403).build();

        Optional<User> existingUser = userService.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.status(400).body("User with that email already exists");
        }

        User newUser = new User(
                user.getEmail(),
                user.getName(),
                user.getSurname(),
                this.passwordEncoder.encode(user.getPassword()),
                user.getPermission()
        );

        userService.save(newUser);

        UserResponse response = new UserResponse(
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getPermission()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_DELETE_USER))
            return ResponseEntity.status(403).build();

        Optional<User> toDelete = userService.findById(Long.parseLong(id));
        if(toDelete.isPresent()){
            this.userService.delete(Long.parseLong(id));
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(404).body("User with given email not found");
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id){
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_READ_USER))
            return ResponseEntity.status(403).build();

        User user = this.userService.findById(Long.parseLong(id)).get();
        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getSurname(), user.getEmail(), user.getPermission());
        return ResponseEntity.ok().body(userResponse);
    }

    @PutMapping(value = "{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser (@PathVariable String id, @RequestBody CreateUserRequest updateData) {
        if(!this.permissionsUtil.checkPermission(PermissionEnum.CAN_UPDATE_USER))
            return ResponseEntity.status(403).build();

        Optional<User> user = this.userService.findById(Long.parseLong(id));
        if (user.isPresent()){
            User u = user.get();
            u.setEmail(updateData.getEmail());
            u.setName(updateData.getName());
            u.setSurname(updateData.getSurname());
            u.setPermission(updateData.getPermission());
            this.userService.save(u);
            return ResponseEntity.ok().body(new UserResponse(
                    u.getName(),
                    u.getSurname(),
                    u.getEmail(),
                    u.getPermission()));
        }
        return ResponseEntity.status(404).body("User with given id not found");
    }
}
