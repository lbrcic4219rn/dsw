package raf.rs.domaci3.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import raf.rs.domaci3.model.User;
import raf.rs.domaci3.services.UserService;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final UserService userService;
    private final SecretKey secretKey;

    public Claims extractClaims(String token) {
        return Jwts.parser().verifyWith(this.secretKey).build().parseSignedClaims(token).getPayload();
    }

    public String extractUsername(String token) {
        return this.extractClaims(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        Optional<User> user = userService.findByEmail(username);
        claims.put("permissions", user.get().getPermission());
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 10000 * 60 * 60 * 10))
                .signWith(this.secretKey).compact();
    }

    public boolean validateToken(String token, UserDetails user) {
        try {
            return (user.getUsername().equals(extractUsername(token)) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
