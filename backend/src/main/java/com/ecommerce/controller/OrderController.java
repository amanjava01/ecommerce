package com.ecommerce.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    @GetMapping("/me/orders")
    public ResponseEntity<Page<Map<String, Object>>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<Map<String, Object>> orders = new ArrayList<>();
        Page<Map<String, Object>> orderPage = new PageImpl<>(orders, PageRequest.of(page, size), 0);
        return ResponseEntity.ok(orderPage);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable Long orderId) {
        Map<String, Object> order = new HashMap<>();
        order.put("id", orderId);
        order.put("status", "PENDING");
        order.put("total", 0.0);
        order.put("items", new ArrayList<>());
        return ResponseEntity.ok(order);
    }

    @PostMapping("/orders")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> orderData) {
        Map<String, Object> order = new HashMap<>();
        order.put("id", System.currentTimeMillis());
        order.put("status", "PENDING");
        order.put("message", "Order created successfully");
        return ResponseEntity.ok(order);
    }
}