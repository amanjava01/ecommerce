package com.ecommerce.config;

import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeData();
    }

    private void initializeData() {
        // Create admin user
        User admin = new User();
        admin.setEmail("admin@ecommerce.com");
        admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
        admin.setRoles(Set.of(User.Role.ROLE_ADMIN, User.Role.ROLE_USER));
        admin.setEnabled(true);
        userRepository.save(admin);

        UserProfile adminProfile = new UserProfile();
        adminProfile.setUser(admin);
        adminProfile.setFullName("System Administrator");
        adminProfile.setPhone("+1234567890");
        admin.setProfile(adminProfile);
        userRepository.save(admin);

        // Create categories
        Category electronics = createCategory("Electronics", "electronics", null);
        Category computers = createCategory("Computers", "computers", electronics);
        Category laptops = createCategory("Laptops", "laptops", computers);
        Category phones = createCategory("Mobile Phones", "mobile-phones", electronics);

        // Create products
        createProduct("MacBook Pro 16\"", "macbook-pro-16", "Apple MacBook Pro 16-inch with M2 Pro chip", 
                     "MBP-16-M2", new BigDecimal("2499.00"), laptops);
        createProduct("iPhone 14 Pro", "iphone-14-pro", "Apple iPhone 14 Pro with A16 Bionic chip", 
                     "IPH-14-PRO", new BigDecimal("999.00"), phones);
        createProduct("Samsung Galaxy S23", "samsung-galaxy-s23", "Samsung Galaxy S23 with Snapdragon 8 Gen 2", 
                     "SGS-23", new BigDecimal("799.00"), phones);
    }

    private Category createCategory(String name, String slug, Category parent) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setParent(parent);
        category.setLevel(parent == null ? 0 : parent.getLevel() + 1);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    private Product createProduct(String name, String slug, String description, String sku, BigDecimal price, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setDescription(description);
        product.setSku(sku);
        product.setPrice(price);
        product.setCategory(category);
        product.setActive(true);
        product.setMainImageUrl("/uploads/placeholder.jpg");
        
        Product savedProduct = productRepository.save(product);
        
        // Create inventory
        Inventory inventory = new Inventory();
        inventory.setProduct(savedProduct);
        inventory.setStock(100);
        inventory.setReserved(0);
        savedProduct.setInventory(inventory);
        
        return productRepository.save(savedProduct);
    }
}