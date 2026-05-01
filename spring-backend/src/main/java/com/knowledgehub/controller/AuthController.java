package com.knowledgehub.controller;

import com.knowledgehub.model.User;
import com.knowledgehub.repository.UserRepository;
import com.knowledgehub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("student"); // default role
        
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", savedUser.getId());
        userData.put("name", savedUser.getName());
        userData.put("email", savedUser.getEmail());
        userData.put("role", savedUser.getRole());
        
        response.put("user", userData);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("name", user.getName());
                userData.put("email", user.getEmail());
                userData.put("role", user.getRole());
                
                response.put("user", userData);
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
