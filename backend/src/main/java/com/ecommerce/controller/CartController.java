package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart() {
        Map<String, Object> cart = new HashMap<>();
        cart.put("items", new ArrayList<>());
        cart.put("total", 0.0);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<Map<String, String>> addToCart(@RequestBody Map<String, Object> request) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Item added to cart");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/items/{itemId}")
    public ResponseEntity<Map<String, String>> updateCartItem(
            @PathVariable Long itemId, 
            @RequestBody Map<String, Integer> request) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart item updated");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long itemId) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Item removed from cart");
        return ResponseEntity.ok(response);
    }
}