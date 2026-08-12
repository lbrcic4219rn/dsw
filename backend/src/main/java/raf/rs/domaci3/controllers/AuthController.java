package raf.rs.domaci3.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import raf.rs.domaci3.config.JwtProperties;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.requests.LoginRequest;
import raf.rs.domaci3.responses.UserResponse;
import raf.rs.domaci3.services.UserService;
import raf.rs.domaci3.util.JwtUtil;

import java.time.Duration;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    public static final String TOKEN_COOKIE = "jwt_token";

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).build();
        }

        String token = jwtUtil.generateToken(loginRequest.getEmail());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildTokenCookie(token, Duration.ofHours(10)).toString())
                .body(toUserResponse(loginRequest.getEmail()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        UserResponse response = toUserResponse(authentication.getName());
        return response == null ? ResponseEntity.status(401).build() : ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, buildTokenCookie("", Duration.ZERO).toString())
                .build();
    }

    private ResponseCookie buildTokenCookie(String value, Duration maxAge) {
        return ResponseCookie.from(TOKEN_COOKIE, value)
                .httpOnly(true)
                .secure(this.jwtProperties.cookieSecure())
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
    }

    private UserResponse toUserResponse(String email) {
        Optional<User> user = userService.findByEmail(email);
        return user.map(u -> new UserResponse(u.getId(), u.getName(), u.getSurname(), u.getEmail(), u.getPermission()))
                .orElse(null);
    }
}
