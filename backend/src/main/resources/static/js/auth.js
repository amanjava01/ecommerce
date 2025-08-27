// Authentication Management
class AuthManager {
    constructor() {
        this.modal = document.getElementById('login-modal');
        this.authBtn = document.getElementById('auth-btn');
        this.userDropdown = document.getElementById('user-dropdown');
        this.logoutBtn = document.getElementById('logout-btn');
        
        this.initializeAuth();
        this.bindEvents();
    }

    initializeAuth() {
        const user = api.getCurrentUser();
        if (user) {
            this.showUserMenu(user);
        } else {
            this.showLoginButton();
        }
    }

    bindEvents() {
        if (!this.modal || !this.authBtn) {
            console.error('Required elements not found for auth manager');
            return;
        }

        // Modal events
        const closeBtn = this.modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Tab switching
        const tabBtns = this.modal.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Form submissions
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Auth button click
        this.authBtn.addEventListener('click', () => {
            if (api.isAuthenticated()) {
                this.toggleUserDropdown();
            } else {
                this.openModal();
            }
        });

        // Logout
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.userDropdown && !e.target.closest('.user-menu')) {
                this.userDropdown.style.display = 'none';
            }
        });
    }

    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.clearForms();
    }

    switchTab(tab) {
        const tabBtns = this.modal.querySelectorAll('.tab-btn');
        const forms = this.modal.querySelectorAll('.auth-form');

        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        forms.forEach(form => {
            form.style.display = form.id === `${tab}-form` ? 'block' : 'none';
        });

        this.clearForms();
    }

    clearForms() {
        const forms = this.modal.querySelectorAll('.auth-form');
        forms.forEach(form => {
            form.reset();
            this.clearFormErrors(form);
        });
    }

    clearFormErrors(form) {
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
        
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    showFormError(form, message) {
        this.clearFormErrors(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #ef4444; margin-bottom: 1rem; text-align: center;';
        errorDiv.textContent = message;
        
        form.insertBefore(errorDiv, form.querySelector('.submit-btn'));
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = form.querySelector('.submit-btn');

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';

            const response = await api.login(email, password);
            
            this.showUserMenu({ email: response.email });
            this.closeModal();
            showToast('Login successful!', 'success');
            
            // Refresh cart count
            if (window.cartManager) {
                window.cartManager.updateCartCount();
            }

        } catch (error) {
            this.showFormError(form, error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const fullName = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const submitBtn = form.querySelector('.submit-btn');

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';

            const response = await api.register(email, password, fullName);
            
            this.showUserMenu({ email: response.email });
            this.closeModal();
            showToast('Account created successfully!', 'success');
            
            // Refresh cart count
            if (window.cartManager) {
                window.cartManager.updateCartCount();
            }

        } catch (error) {
            this.showFormError(form, error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    }

    handleLogout() {
        api.logout();
        this.showLoginButton();
        showToast('Logged out successfully', 'success');
        
        // Clear cart count
        if (window.cartManager) {
            window.cartManager.updateCartCount();
        }
    }

    showLoginButton() {
        this.authBtn.textContent = 'Login';
        this.authBtn.onclick = () => this.openModal();
        this.userDropdown.style.display = 'none';
    }

    showUserMenu(user) {
        this.authBtn.textContent = user.email.split('@')[0];
        this.authBtn.onclick = () => this.toggleUserDropdown();
    }

    toggleUserDropdown() {
        if (this.userDropdown) {
            const isVisible = this.userDropdown.style.display === 'block';
            this.userDropdown.style.display = isVisible ? 'none' : 'block';
        }
    }
}

// Toast function moved to utils.js

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});