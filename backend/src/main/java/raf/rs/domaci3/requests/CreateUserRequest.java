package raf.rs.domaci3.requests;

import lombok.Data;
import raf.rs.domaci3.model.Permission;

@Data
public class CreateUserRequest {
    private String name;
    private String surname;
    private String email;
    private String password;
    private Permission permission;
}
