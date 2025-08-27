package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "desc") String dir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<Product> products = productService.findProducts(
            search, category, minPrice, maxPrice, sort, dir, page, size);
        
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductDetailResponse> getProduct(@PathVariable String slug) {
        return productService.findBySlug(slug)
            .map(product -> {
                List<Product> relatedProducts = productService.getRelatedProducts(
                    product.getCategory().getId(), product.getId(), 4);
                
                return ResponseEntity.ok(new ProductDetailResponse(product, relatedProducts));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts(
            @RequestParam(defaultValue = "8") int limit) {
        
        List<Product> products = productService.getFeaturedProducts(limit);
        return ResponseEntity.ok(products);
    }

    // Response DTOs
    public static class ProductDetailResponse {
        private Product product;
        private List<Product> relatedProducts;
        
        public ProductDetailResponse(Product product, List<Product> relatedProducts) {
            this.product = product;
            this.relatedProducts = relatedProducts;
        }
        
        public Product getProduct() { return product; }
        public void setProduct(Product product) { this.product = product; }
        
        public List<Product> getRelatedProducts() { return relatedProducts; }
        public void setRelatedProducts(List<Product> relatedProducts) { this.relatedProducts = relatedProducts; }
    }
}