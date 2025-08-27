package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Cacheable(value = "products", key = "#slug")
    public Optional<Product> findBySlug(String slug) {
        return productRepository.findBySlug(slug);
    }

    public Page<Product> findProducts(String search, Long categoryId, BigDecimal minPrice, 
                                    BigDecimal maxPrice, String sortBy, String sortDir, 
                                    int page, int size) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), getSortField(sortBy));
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return productRepository.findByFilters(search, categoryId, minPrice, maxPrice, pageable);
    }

    @Cacheable(value = "featuredProducts")
    public List<Product> getFeaturedProducts(int limit) {
        return productRepository.findFeaturedProducts(PageRequest.of(0, limit));
    }

    public List<Product> getRelatedProducts(Long categoryId, Long excludeId, int limit) {
        return productRepository.findRelatedProducts(categoryId, excludeId, PageRequest.of(0, limit));
    }

    @Transactional
    public Product createProduct(Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("SKU already exists");
        }
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setActive(productDetails.isActive());
        
        return productRepository.save(product);
    }

    private String getSortField(String sortBy) {
        return switch (sortBy) {
            case "price" -> "price";
            case "name" -> "name";
            case "rating" -> "averageRating";
            case "newest" -> "createdAt";
            default -> "createdAt";
        };
    }
}