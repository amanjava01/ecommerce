// Reusable UI Components

// Product Card Component
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageUrl = product.mainImageUrl || '/uploads/placeholder.jpg';
    const rating = product.averageRating || 0;
    const reviewCount = product.reviewCount || 0;
    const isInStock = product.inventory && product.inventory.stock > 0;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" onerror="this.src='/uploads/placeholder.jpg'">
        </div>
        <div class="product-info">
            <h3><a href="/product.html?slug=${product.slug}">${product.name}</a></h3>
            <p>${truncateText(product.description || '', 100)}</p>
            <div class="product-price">$${product.price}</div>
            <div class="product-rating">
                <div class="stars">${generateStars(rating)}</div>
                <span>(${reviewCount})</span>
            </div>
            <button class="add-to-cart" 
                    data-product-id="${product.id}" 
                    ${!isInStock ? 'disabled' : ''}>
                ${isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `;
    
    return card;
}

// Category Card Component
function createCategoryCard(category) {
    const card = document.createElement('a');
    card.className = 'category-card';
    card.href = `/products.html?category=${category.id}`;
    
    card.innerHTML = `
        <div class="category-icon">📦</div>
        <h3>${category.name}</h3>
        <p>${category.productCount || 0} products</p>
    `;
    
    return card;
}

// Order Item Component
function createOrderItem(item) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    orderItem.innerHTML = `
        <div class="item-image">
            <img src="${item.product?.mainImageUrl || '/uploads/placeholder.jpg'}" 
                 alt="${item.name}">
        </div>
        <div class="item-details">
            <h4>${item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.unitPrice}</p>
        </div>
        <div class="item-total">
            $${item.lineTotal}
        </div>
    `;
    
    return orderItem;
}

// Cart Item Component
function createCartItem(item, isLocal = false) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    const product = item.product;
    const itemId = isLocal ? product.id : item.id;
    
    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.mainImageUrl || '/uploads/placeholder.jpg'}" 
                 alt="${product.name}">
        </div>
        <div class="item-details">
            <h4>${product.name}</h4>
            <p>$${item.priceAtAdd || product.price}</p>
        </div>
        <div class="item-controls">
            <div class="quantity-controls">
                <button class="qty-btn minus" data-item-id="${itemId}" data-is-local="${isLocal}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn plus" data-item-id="${itemId}" data-is-local="${isLocal}">+</button>
            </div>
            <button class="remove-item" data-item-id="${itemId}" data-is-local="${isLocal}">Remove</button>
        </div>
        <div class="item-total">
            $${((item.priceAtAdd || product.price) * item.quantity).toFixed(2)}
        </div>
    `;
    
    return cartItem;
}

// Review Component
function createReviewCard(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    const reviewDate = new Date(review.createdAt).toLocaleDateString();
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <strong>${review.user?.profile?.fullName || 'Anonymous'}</strong>
                <div class="review-rating">${generateStars(review.rating)}</div>
            </div>
            <div class="review-date">${reviewDate}</div>
        </div>
        <div class="review-content">
            ${review.title ? `<h4>${review.title}</h4>` : ''}
            <p>${review.body}</p>
        </div>
    `;
    
    return reviewCard;
}

// Pagination Component
function createPagination(currentPage, totalPages, onPageChange) {
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    // Previous button
    if (currentPage > 0) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.onclick = () => onPageChange(currentPage - 1);
        pagination.appendChild(prevBtn);
    }
    
    // Page numbers
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i + 1;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => onPageChange(i);
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    if (currentPage < totalPages - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.onclick = () => onPageChange(currentPage + 1);
        pagination.appendChild(nextBtn);
    }
    
    return pagination;
}

// Loading Spinner Component
function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
        <div class="spinner"></div>
        <p>Loading...</p>
    `;
    return spinner;
}

// Empty State Component
function createEmptyState(message, actionText = null, actionCallback = null) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    emptyState.innerHTML = `
        <div class="empty-icon">📭</div>
        <h3>No items found</h3>
        <p>${message}</p>
        ${actionText ? `<button class="cta-button">${actionText}</button>` : ''}
    `;
    
    if (actionCallback && actionText) {
        emptyState.querySelector('.cta-button').onclick = actionCallback;
    }
    
    return emptyState;
}

// Utility Functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Search and Filter Components
function createFilterSection(title, options, selectedValue, onFilterChange) {
    const section = document.createElement('div');
    section.className = 'filter-section';
    
    section.innerHTML = `
        <h4>${title}</h4>
        <select class="filter-select">
            <option value="">All</option>
            ${options.map(option => 
                `<option value="${option.value}" ${option.value === selectedValue ? 'selected' : ''}>
                    ${option.label}
                </option>`
            ).join('')}
        </select>
    `;
    
    section.querySelector('.filter-select').addEventListener('change', (e) => {
        onFilterChange(e.target.value);
    });
    
    return section;
}

function createSortSection(options, selectedValue, onSortChange) {
    const section = document.createElement('div');
    section.className = 'sort-section';
    
    section.innerHTML = `
        <label>Sort by:</label>
        <select class="sort-select">
            ${options.map(option => 
                `<option value="${option.value}" ${option.value === selectedValue ? 'selected' : ''}>
                    ${option.label}
                </option>`
            ).join('')}
        </select>
    `;
    
    section.querySelector('.sort-select').addEventListener('change', (e) => {
        onSortChange(e.target.value);
    });
    
    return section;
}

// Modal Component
function createModal(title, content, actions = []) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${actions.map(action => 
                    `<button class="btn ${action.class || ''}" data-action="${action.action}">
                        ${action.text}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Bind events
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    // Bind action buttons
    actions.forEach(action => {
        const btn = modal.querySelector(`[data-action="${action.action}"]`);
        if (btn && action.callback) {
            btn.onclick = action.callback;
        }
    });
    
    document.body.appendChild(modal);
    return modal;
}