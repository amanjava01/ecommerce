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

            const categories = await api.getCategories();
            const topCategories = categories.slice(0, 6); // Show top 6 categories

            categoriesGrid.innerHTML = '';
            topCategories.forEach(category => {
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

            const products = await api.getFeaturedProducts(8);

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

            const response = await api.getProducts(filters);
            const products = response.content || [];

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

            // Add pagination
            if (response.totalPages > 1) {
                const pagination = createPagination(
                    response.number,
                    response.totalPages,
                    (page) => this.changePage(page)
                );
                productsContainer.appendChild(pagination);
            }

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
            const response = await api.getProduct(slug);
            this.renderProductDetail(response.product, response.relatedProducts);
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
                        <img src="${product.mainImageUrl || '/uploads/placeholder.jpg'}" 
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
            let isLocal = false;

            if (api.isAuthenticated()) {
                const cart = await api.getCart();
                cartItems = cart.items || [];
            } else {
                const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
                cartItems = localCart.items || [];
                isLocal = true;
            }

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

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ECommerceApp();
});