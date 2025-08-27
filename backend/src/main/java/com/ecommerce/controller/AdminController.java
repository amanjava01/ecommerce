package com.ecommerce.controller;

import com.ecommerce.service.MetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private MetricsService metricsService;

    @GetMapping(value = "/metrics/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamMetrics() {
        return metricsService.createMetricsStream();
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = metricsService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/metrics/current")
    public ResponseEntity<Map<String, Object>> getCurrentMetrics() {
        Map<String, Object> metrics = metricsService.getCurrentMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/orders/recent")
    public ResponseEntity<java.util.List<Map<String, Object>>> getRecentOrders() {
        java.util.List<Map<String, Object>> orders = new java.util.ArrayList<>();
        
        // Mock recent orders
        Map<String, Object> order1 = new java.util.HashMap<>();
        order1.put("id", 1001L);
        order1.put("total", 99.99);
        order1.put("status", "PAID");
        order1.put("createdAt", java.time.LocalDateTime.now().toString());
        
        Map<String, Object> user1 = new java.util.HashMap<>();
        Map<String, Object> profile1 = new java.util.HashMap<>();
        profile1.put("fullName", "John Doe");
        user1.put("profile", profile1);
        order1.put("user", user1);
        
        orders.add(order1);
        
        return ResponseEntity.ok(orders);
    }
}