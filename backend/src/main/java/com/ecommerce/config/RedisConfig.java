package com.ecommerce.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Configuration
public class RedisConfig {

    @Bean
    @Primary
    @Profile("dev")
    @ConditionalOnProperty(name = "spring.data.redis.host", matchIfMissing = true)
    public CacheManager fallbackCacheManager() {
        return new ConcurrentMapCacheManager("products", "categories", "featuredProducts", "rootCategories");
    }
}