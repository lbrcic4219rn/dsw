package raf.rs.domaci3.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.repositories.ErrorMessageRepo;
import raf.rs.domaci3.services.UserService;

import java.util.Optional;

@RestController
@RequestMapping("api/logs")
@RequiredArgsConstructor
public class ErrorMessageController {
    private final ErrorMessageRepo errorMessageRepo;
    private final UserService userService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userService.findByEmail(username);

        if(user.isPresent()) {
            return ResponseEntity.ok(errorMessageRepo.findByUserId(user.get().getId()));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
