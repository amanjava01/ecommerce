// API Configuration and Utilities
class API {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('accessToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    // Get authentication headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(options.auth !== false),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            // Handle token refresh if needed
            if (response.status === 401 && this.token) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request
                    config.headers = this.getHeaders();
                    const retryResponse = await fetch(url, config);
                    return this.handleResponse(retryResponse);
                } else {
                    // Refresh failed, redirect to login
                    this.logout();
                    throw new Error('Authentication failed');
                }
            }

            return this.handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Handle API response
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } else {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        }
    }

    // Authentication methods
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            auth: false
        });
        
        if (response.accessToken) {
            this.setToken(response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                id: response.userId,
                email: response.email
            }));
        }
        
        return response;
    }

    async register(email, password, fullName) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, fullName }),
            auth: false
        });
        
        if (response.accessToken) {
            this.setToken(response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                id: response.userId,
                email: response.email
            }));
        }
        
        return response;
    }

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return false;

            const response = await this.request('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
                auth: false
            });

            if (response.accessToken) {
                this.setToken(response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
        
        return false;
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    // Product methods
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products?${queryString}`, { auth: false });
    }

    async getProduct(slug) {
        return this.request(`/products/${slug}`, { auth: false });
    }

    async getFeaturedProducts(limit = 8) {
        return this.request(`/products/featured?limit=${limit}`, { auth: false });
    }

    // Category methods
    async getCategories() {
        return this.request('/categories', { auth: false });
    }

    // Cart methods
    async getCart() {
        return this.request('/cart');
    }

    async addToCart(productId, quantity = 1) {
        return this.request('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }

    async updateCartItem(itemId, quantity) {
        return this.request(`/cart/items/${itemId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity })
        });
    }

    async removeFromCart(itemId) {
        return this.request(`/cart/items/${itemId}`, {
            method: 'DELETE'
        });
    }

    // Order methods
    async getOrders(page = 0, size = 10) {
        return this.request(`/me/orders?page=${page}&size=${size}`);
    }

    async getOrder(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // User methods
    async getProfile() {
        return this.request('/me');
    }

    async updateProfile(profileData) {
        return this.request('/me', {
            method: 'PATCH',
            body: JSON.stringify(profileData)
        });
    }

    // Admin methods
    async getMetricsStream() {
        const response = await fetch(`${this.baseURL}/admin/metrics/stream`, {
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to connect to metrics stream');
        }
        
        return response;
    }

    async getDashboardSummary() {
        return this.request('/admin/dashboard/summary');
    }

    // Utility methods
    isAuthenticated() {
        return !!this.token;
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

// Create global API instance
window.api = new API();