package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/me")
public class UserController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProfile() {
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", 1L);
        profile.put("email", "user@example.com");
        profile.put("fullName", "Demo User");
        return ResponseEntity.ok(profile);
    }

    @PatchMapping
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> profileData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }
}