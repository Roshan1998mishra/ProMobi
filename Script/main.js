document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modal-body');
    const span = document.getElementsByClassName('close')[0];
    let products = [];
    let cart = [];

    // Fetch products from the API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<p>Failed to load products.</p>';
        });

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}" onclick="showProductDetails(${product.id})">
                <div class="product-details">
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;

            productList.appendChild(productElement);
        });
    }

    window.addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        cart.push(product);
        displayCart();
    };

    function displayCart() {
        cartList.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <h3>${item.title}</h3>
                <img src="${item.image}" alt="${item.title}" style="max-width: 50px;">
                <p><strong>Price:</strong> $${item.price}</p>
            `;

            cartList.appendChild(cartItem);
        });
        cartTotal.textContent = total.toFixed(2);
    }

    window.filterProducts = () => {
        const searchQuery = document.getElementById('search-bar').value.toLowerCase();
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(checkbox => checkbox.value);

        const filteredProducts = products.filter(product => {
            const matchesSearchQuery = product.title.toLowerCase().includes(searchQuery) || product.description.toLowerCase().includes(searchQuery);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);

            return matchesSearchQuery && matchesCategory;
        });

        displayProducts(filteredProducts);
    };

    window.showProductDetails = (productId) => {
        const product = products.find(p => p.id === productId);

        modalBody.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Category:</strong> ${product.category}</p>
        `;

        modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = () => {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});
