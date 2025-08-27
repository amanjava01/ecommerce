// Cart Management
class CartManager {
    constructor() {
        this.cartCount = document.getElementById('cart-count');
        this.localCart = this.getLocalCart();
        
        if (this.cartCount) {
            this.updateCartCount();
        }
        this.bindEvents();
    }

    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.dataset.quantity) || 1;
                this.addToCart(productId, quantity, e.target);
            }
        });
    }

    getLocalCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : { items: [] };
    }

    saveLocalCart() {
        localStorage.setItem('cart', JSON.stringify(this.localCart));
    }

    async addToCart(productId, quantity = 1, button = null) {
        try {
            if (button) {
                button.disabled = true;
                button.textContent = 'Adding...';
            }

            if (api.isAuthenticated()) {
                // Add to server cart
                await api.addToCart(productId, quantity);
                showToast('Added to cart!', 'success');
            } else {
                // Add to local cart
                this.addToLocalCart(productId, quantity);
                showToast('Added to cart! Login to sync across devices.', 'success');
            }

            this.updateCartCount();

        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = 'Add to Cart';
            }
        }
    }

    addToLocalCart(productId, quantity) {
        const existingItem = this.localCart.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.localCart.items.push({
                productId: parseInt(productId),
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveLocalCart();
    }

    async updateCartCount() {
        if (!this.cartCount) return;
        
        try {
            let count = 0;

            if (api.isAuthenticated()) {
                // Get server cart count
                try {
                    const cart = await api.getCart();
                    count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                } catch (apiError) {
                    // Fallback to local cart if API fails
                    count = this.localCart.items.reduce((sum, item) => sum + item.quantity, 0);
                }
            } else {
                // Get local cart count
                count = this.localCart.items.reduce((sum, item) => sum + item.quantity, 0);
            }

            this.cartCount.textContent = count;
            
        } catch (error) {
            console.error('Failed to update cart count:', error);
            // Fallback to local cart count
            const count = this.localCart.items.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCount.textContent = count;
        }
    }

    async syncCartOnLogin() {
        if (!api.isAuthenticated() || this.localCart.items.length === 0) {
            return;
        }

        try {
            // Sync local cart items to server
            for (const item of this.localCart.items) {
                await api.addToCart(item.productId, item.quantity);
            }

            // Clear local cart after sync
            this.localCart = { items: [] };
            this.saveLocalCart();
            
            showToast('Cart synced successfully!', 'success');
            this.updateCartCount();

        } catch (error) {
            console.error('Failed to sync cart:', error);
            showToast('Failed to sync cart items', 'error');
        }
    }

    async removeFromCart(itemId, isLocal = false) {
        try {
            if (isLocal) {
                this.localCart.items = this.localCart.items.filter(item => item.productId !== parseInt(itemId));
                this.saveLocalCart();
            } else {
                await api.removeFromCart(itemId);
            }

            this.updateCartCount();
            showToast('Item removed from cart', 'success');
            
            // Reload cart page if we're on it
            if (window.location.pathname.includes('cart.html') && window.app) {
                window.app.loadCartPage();
            }

        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    async updateQuantity(itemId, quantity, isLocal = false) {
        try {
            if (quantity <= 0) {
                return this.removeFromCart(itemId, isLocal);
            }

            if (isLocal) {
                const item = this.localCart.items.find(item => item.productId === parseInt(itemId));
                if (item) {
                    item.quantity = quantity;
                    this.saveLocalCart();
                }
            } else {
                await api.updateCartItem(itemId, quantity);
            }

            this.updateCartCount();
            
            // Reload cart page if we're on it
            if (window.location.pathname.includes('cart.html') && window.app) {
                window.app.loadCartPage();
            }

        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    clearLocalCart() {
        this.localCart = { items: [] };
        this.saveLocalCart();
        this.updateCartCount();
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});