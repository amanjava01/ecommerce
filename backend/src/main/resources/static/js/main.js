// Main Application Logic
class ECommerceApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        if (path.includes('products.html')) return 'products';
        if (path.includes('product.html')) return 'product';
        if (path.includes('cart.html')) return 'cart';
        if (path.includes('admin')) return 'admin';
        return 'other';
    }

    async init() {
        try {
            await this.loadPageContent();
            this.bindGlobalEvents();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            showToast('Failed to load page content', 'error');
        }
    }

    async loadPageContent() {
        switch (this.currentPage) {
            case 'home':
                await this.loadHomePage();
                break;
            case 'products':
                await this.loadProductsPage();
                break;
            case 'product':
                await this.loadProductPage();
                break;
            case 'cart':
                await this.loadCartPage();
                break;
        }
    }

    async loadHomePage() {
        await Promise.all([
            this.loadFeaturedCategories(),
            this.loadFeaturedProducts()
        ]);
    }

    async loadFeaturedCategories() {
        try {
            const categoriesGrid = document.getElementById('categories-grid');
            if (!categoriesGrid) return;

            categoriesGrid.innerHTML = '<div class="loading">Loading categories...</div>';

            // Mock categories data since API might not be ready
            const categories = [
                { id: 1, name: 'Electronics', productCount: 150 },
                { id: 2, name: 'Clothing', productCount: 200 },
                { id: 3, name: 'Home & Garden', productCount: 80 },
                { id: 4, name: 'Sports', productCount: 120 },
                { id: 5, name: 'Books', productCount: 300 },
                { id: 6, name: 'Beauty', productCount: 90 }
            ];

            categoriesGrid.innerHTML = '';
            categories.forEach(category => {
                const categoryCard = createCategoryCard(category);
                categoriesGrid.appendChild(categoryCard);
            });

        } catch (error) {
            console.error('Failed to load categories:', error);
            const categoriesGrid = document.getElementById('categories-grid');
            if (categoriesGrid) {
                categoriesGrid.innerHTML = '<p>Failed to load categories</p>';
            }
        }
    }

    async loadFeaturedProducts() {
        try {
            const productsGrid = document.getElementById('featured-products');
            if (!productsGrid) return;

            productsGrid.innerHTML = '<div class="loading">Loading products...</div>';

            // Mock products data since API might not be ready
            const products = [
                {
                    id: 1,
                    name: 'Wireless Headphones',
                    slug: 'wireless-headphones',
                    description: 'High-quality wireless headphones with noise cancellation',
                    price: 99.99,
                    mainImageUrl: '/uploads/headphones.svg',
                    averageRating: 4.5,
                    reviewCount: 128,
                    inventory: { stock: 50 }
                },
                {
                    id: 2,
                    name: 'Smart Watch',
                    slug: 'smart-watch',
                    description: 'Feature-rich smartwatch with health monitoring',
                    price: 199.99,
                    mainImageUrl: '/uploads/smartwatch.svg',
                    averageRating: 4.2,
                    reviewCount: 89,
                    inventory: { stock: 30 }
                },
                {
                    id: 3,
                    name: 'Laptop Stand',
                    slug: 'laptop-stand',
                    description: 'Ergonomic laptop stand for better posture',
                    price: 49.99,
                    mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.7,
                    reviewCount: 156,
                    inventory: { stock: 75 }
                },
                {
                    id: 4,
                    name: 'Coffee Maker',
                    slug: 'coffee-maker',
                    description: 'Programmable coffee maker with thermal carafe',
                    price: 79.99,
                    mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.3,
                    reviewCount: 67,
                    inventory: { stock: 25 }
                }
            ];

            productsGrid.innerHTML = '';
            products.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });

        } catch (error) {
            console.error('Failed to load featured products:', error);
            const productsGrid = document.getElementById('featured-products');
            if (productsGrid) {
                productsGrid.innerHTML = '<p>Failed to load products</p>';
            }
        }
    }

    async loadProductsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const filters = {
            search: urlParams.get('search') || '',
            category: urlParams.get('category') || '',
            minPrice: urlParams.get('minPrice') || '',
            maxPrice: urlParams.get('maxPrice') || '',
            sort: urlParams.get('sort') || 'newest',
            page: parseInt(urlParams.get('page')) || 0,
            size: 20
        };

        await this.loadProducts(filters);
        this.setupProductFilters(filters);
    }

    async loadProducts(filters) {
        try {
            const productsContainer = document.getElementById('products-container');
            if (!productsContainer) return;

            productsContainer.innerHTML = '<div class="loading">Loading products...</div>';

            // Mock products data for products page
            const allProducts = [
                {
                    id: 1, name: 'Wireless Headphones', slug: 'wireless-headphones',
                    description: 'High-quality wireless headphones with noise cancellation',
                    price: 99.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.5, reviewCount: 128, inventory: { stock: 50 }
                },
                {
                    id: 2, name: 'Smart Watch', slug: 'smart-watch',
                    description: 'Feature-rich smartwatch with health monitoring',
                    price: 199.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.2, reviewCount: 89, inventory: { stock: 30 }
                },
                {
                    id: 3, name: 'Laptop Stand', slug: 'laptop-stand',
                    description: 'Ergonomic laptop stand for better posture',
                    price: 49.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.7, reviewCount: 156, inventory: { stock: 75 }
                },
                {
                    id: 4, name: 'Coffee Maker', slug: 'coffee-maker',
                    description: 'Programmable coffee maker with thermal carafe',
                    price: 79.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.3, reviewCount: 67, inventory: { stock: 25 }
                },
                {
                    id: 5, name: 'Bluetooth Speaker', slug: 'bluetooth-speaker',
                    description: 'Portable wireless speaker with excellent sound quality',
                    price: 59.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.4, reviewCount: 92, inventory: { stock: 40 }
                },
                {
                    id: 6, name: 'Wireless Mouse', slug: 'wireless-mouse',
                    description: 'Ergonomic wireless mouse with long battery life',
                    price: 29.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.1, reviewCount: 203, inventory: { stock: 100 }
                }
            ];

            let products = allProducts;

            // Apply search filter
            if (filters.search) {
                products = products.filter(p => 
                    p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    p.description.toLowerCase().includes(filters.search.toLowerCase())
                );
            }

            // Apply price filters
            if (filters.minPrice) {
                products = products.filter(p => p.price >= parseFloat(filters.minPrice));
            }
            if (filters.maxPrice) {
                products = products.filter(p => p.price <= parseFloat(filters.maxPrice));
            }

            // Apply sorting
            switch (filters.sort) {
                case 'price-asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'rating':
                    products.sort((a, b) => b.averageRating - a.averageRating);
                    break;
                default: // newest
                    break;
            }

            productsContainer.innerHTML = '';

            if (products.length === 0) {
                const emptyState = createEmptyState(
                    'No products found matching your criteria',
                    'Clear Filters',
                    () => this.clearFilters()
                );
                productsContainer.appendChild(emptyState);
                return;
            }

            const productsGrid = document.createElement('div');
            productsGrid.className = 'products-grid';

            products.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });

            productsContainer.appendChild(productsGrid);

        } catch (error) {
            console.error('Failed to load products:', error);
            const productsContainer = document.getElementById('products-container');
            if (productsContainer) {
                productsContainer.innerHTML = '<p>Failed to load products</p>';
            }
        }
    }

    setupProductFilters(currentFilters) {
        // Setup search
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.value = currentFilters.search;
            searchInput.addEventListener('input', debounce((e) => {
                this.updateFilter('search', e.target.value);
            }, 500));
        }

        // Setup sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = currentFilters.sort;
            sortSelect.addEventListener('change', (e) => {
                this.updateFilter('sort', e.target.value);
            });
        }

        // Setup price filters
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        
        if (minPriceInput) {
            minPriceInput.value = currentFilters.minPrice;
            minPriceInput.addEventListener('change', (e) => {
                this.updateFilter('minPrice', e.target.value);
            });
        }

        if (maxPriceInput) {
            maxPriceInput.value = currentFilters.maxPrice;
            maxPriceInput.addEventListener('change', (e) => {
                this.updateFilter('maxPrice', e.target.value);
            });
        }
    }

    updateFilter(key, value) {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (value) {
            urlParams.set(key, value);
        } else {
            urlParams.delete(key);
        }
        
        // Reset to first page when filters change
        if (key !== 'page') {
            urlParams.delete('page');
        }

        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, '', newUrl);
        
        // Reload products with new filters
        this.loadProductsPage();
    }

    changePage(page) {
        this.updateFilter('page', page);
    }

    clearFilters() {
        window.history.pushState({}, '', window.location.pathname);
        this.loadProductsPage();
    }

    async loadProductPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            showToast('Product not found', 'error');
            return;
        }

        try {
            // Mock product data
            const mockProducts = {
                'wireless-headphones': {
                    id: 1, name: 'Wireless Headphones', slug: 'wireless-headphones',
                    description: 'High-quality wireless headphones with advanced noise cancellation technology. Perfect for music lovers and professionals who need crystal clear audio quality.',
                    price: 99.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.5, reviewCount: 128, inventory: { stock: 50 }
                },
                'smart-watch': {
                    id: 2, name: 'Smart Watch', slug: 'smart-watch',
                    description: 'Feature-rich smartwatch with comprehensive health monitoring, GPS tracking, and long battery life. Stay connected and healthy.',
                    price: 199.99, mainImageUrl: '/uploads/placeholder.svg',
                    averageRating: 4.2, reviewCount: 89, inventory: { stock: 30 }
                }
            };

            const product = mockProducts[slug];
            if (!product) {
                showToast('Product not found', 'error');
                return;
            }

            const relatedProducts = Object.values(mockProducts).filter(p => p.slug !== slug).slice(0, 3);
            this.renderProductDetail(product, relatedProducts);
        } catch (error) {
            console.error('Failed to load product:', error);
            showToast('Failed to load product', 'error');
        }
    }

    renderProductDetail(product, relatedProducts) {
        // Update page title
        document.title = `${product.name} - E-Commerce Store`;

        // Render product details
        const productContainer = document.getElementById('product-container');
        if (productContainer) {
            productContainer.innerHTML = `
                <div class="product-detail">
                    <div class="product-images">
                        <img src="${product.mainImageUrl || '/uploads/placeholder.svg'}" 
                             alt="${product.name}" class="main-image">
                    </div>
                    <div class="product-info">
                        <h1>${product.name}</h1>
                        <div class="product-rating">
                            ${generateStars(product.averageRating || 0)}
                            <span>(${product.reviewCount || 0} reviews)</span>
                        </div>
                        <div class="product-price">$${product.price}</div>
                        <div class="product-description">
                            <p>${product.description}</p>
                        </div>
                        <div class="product-actions">
                            <button class="add-to-cart" data-product-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Render related products
        const relatedContainer = document.getElementById('related-products');
        if (relatedContainer && relatedProducts.length > 0) {
            relatedContainer.innerHTML = '<h3>Related Products</h3>';
            const relatedGrid = document.createElement('div');
            relatedGrid.className = 'products-grid';
            
            relatedProducts.forEach(product => {
                const productCard = createProductCard(product);
                relatedGrid.appendChild(productCard);
            });
            
            relatedContainer.appendChild(relatedGrid);
        }
    }

    async loadCartPage() {
        try {
            const cartContainer = document.getElementById('cart-container');
            if (!cartContainer) return;

            cartContainer.innerHTML = '<div class="loading">Loading cart...</div>';

            let cartItems = [];
            let isLocal = true;

            // Always use local cart for now
            const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
            const rawItems = localCart.items || [];

            // Mock product data for cart items
            const mockProducts = {
                1: { id: 1, name: 'Wireless Headphones', price: 99.99, mainImageUrl: '/uploads/placeholder.svg' },
                2: { id: 2, name: 'Smart Watch', price: 199.99, mainImageUrl: '/uploads/placeholder.svg' },
                3: { id: 3, name: 'Laptop Stand', price: 49.99, mainImageUrl: '/uploads/placeholder.svg' },
                4: { id: 4, name: 'Coffee Maker', price: 79.99, mainImageUrl: '/uploads/placeholder.svg' },
                5: { id: 5, name: 'Bluetooth Speaker', price: 59.99, mainImageUrl: '/uploads/placeholder.svg' },
                6: { id: 6, name: 'Wireless Mouse', price: 29.99, mainImageUrl: '/uploads/placeholder.svg' }
            };

            // Convert raw cart items to full cart items with product data
            cartItems = rawItems.map(item => ({
                id: item.productId,
                quantity: item.quantity,
                product: mockProducts[item.productId],
                priceAtAdd: mockProducts[item.productId]?.price || 0
            })).filter(item => item.product); // Filter out items with missing products

            this.renderCart(cartItems, isLocal);

        } catch (error) {
            console.error('Failed to load cart:', error);
            const cartContainer = document.getElementById('cart-container');
            if (cartContainer) {
                cartContainer.innerHTML = '<p>Failed to load cart</p>';
            }
        }
    }

    renderCart(items, isLocal) {
        const cartContainer = document.getElementById('cart-container');
        
        if (items.length === 0) {
            const emptyState = createEmptyState(
                'Your cart is empty',
                'Continue Shopping',
                () => window.location.href = '/products.html'
            );
            cartContainer.innerHTML = '';
            cartContainer.appendChild(emptyState);
            return;
        }

        let total = 0;
        const cartItemsContainer = document.createElement('div');
        cartItemsContainer.className = 'cart-items';

        items.forEach(item => {
            const cartItem = createCartItem(item, isLocal);
            cartItemsContainer.appendChild(cartItem);
            
            const itemPrice = item.priceAtAdd || item.product?.price || 0;
            total += itemPrice * item.quantity;
        });

        const cartSummary = document.createElement('div');
        cartSummary.className = 'cart-summary';
        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Shipping:</span>
                <span>Free</span>
            </div>
            <div class="summary-line total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn">Proceed to Checkout</button>
        `;

        cartContainer.innerHTML = '';
        cartContainer.appendChild(cartItemsContainer);
        cartContainer.appendChild(cartSummary);

        // Bind cart item events
        this.bindCartEvents();
        
        // Bind checkout button
        const checkoutBtn = cartContainer.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }
    }

    bindCartEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                const itemId = e.target.dataset.itemId;
                const isLocal = e.target.dataset.isLocal === 'true';
                const currentQty = parseInt(e.target.parentElement.querySelector('.quantity').textContent);
                const newQty = e.target.classList.contains('plus') ? currentQty + 1 : currentQty - 1;
                
                if (window.cartManager) {
                    window.cartManager.updateQuantity(itemId, newQty, isLocal);
                }
            }

            if (e.target.classList.contains('remove-item')) {
                const itemId = e.target.dataset.itemId;
                const isLocal = e.target.dataset.isLocal === 'true';
                
                if (window.cartManager) {
                    window.cartManager.removeFromCart(itemId, isLocal);
                }
            }
        });
    }
    
    handleCheckout() {
        if (!api.isAuthenticated()) {
            showToast('Please login to checkout', 'warning');
            if (window.authManager) {
                window.authManager.openModal();
            }
            return;
        }
        
        const cartItems = JSON.parse(localStorage.getItem('cart') || '{"items":[]}').items;
        if (cartItems.length === 0) {
            showToast('Your cart is empty', 'warning');
            return;
        }
        
        // Simple checkout simulation
        showToast('Order placed successfully! (Demo)', 'success');
        localStorage.setItem('cart', JSON.stringify({ items: [] }));
        
        if (window.cartManager) {
            window.cartManager.updateCartCount();
        }
        
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }

    bindGlobalEvents() {
        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        if (searchBtn && searchInput) {
            const performSearch = () => {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `/products.html?search=${encodeURIComponent(query)}`;
                }
            };

            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }
}

// Debounce function moved to utils.js

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ECommerceApp();
});