package com.ecommerce.repository;

import com.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findBySlug(String slug);
    
    List<Category> findByActiveTrue();
    
    List<Category> findByParentIdAndActiveTrue(Long parentId);
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL AND c.active = true ORDER BY c.name")
    List<Category> findRootCategories();
    
    @Query("SELECT c FROM Category c WHERE c.level = :level AND c.active = true ORDER BY c.name")
    List<Category> findByLevel(Integer level);
}