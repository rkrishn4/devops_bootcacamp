// Sample product data
const products = [
    { id: 1, name: 'Product 1', price: 19.99 },
    { id: 2, name: 'Product 2', price: 29.99 },
    // Add more products as needed
];

// Function to display products
function displayProducts() {
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsSection.appendChild(productElement);
    });
}

// Function to add product to the cart
function addToCart(productId) {
    // Implement cart functionality here
    console.log(`Product ${productId} added to cart`);
}

// Display products when the page loads
document.addEventListener('DOMContentLoaded', displayProducts);

