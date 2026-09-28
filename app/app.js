const storageKeys = {
  users: 'pw-framework-users',
  session: 'pw-framework-session',
  carts: 'pw-framework-carts',
  orders: 'pw-framework-orders',
};

// Keep these defaults aligned with .env.example so the framework has deterministic seed data.
const defaultUsers = [
  {
    firstName: 'QA',
    lastName: 'Automation',
    email: 'qa@example.com',
    password: 'Secret123!',
  },
];

const catalog = [
  { id: 'prd-1', name: 'Smart Watch Pro', category: 'Wearables', price: 799.9 },
  { id: 'prd-2', name: 'Noise Cancelling Headphones', category: 'Audio', price: 1299.5 },
  { id: 'prd-3', name: 'UltraWide Monitor', category: 'Office', price: 2199.0 },
  { id: 'prd-4', name: 'Mechanical Keyboard', category: 'Accessories', price: 459.9 },
];

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initializeStore() {
  if (!localStorage.getItem(storageKeys.users)) {
    writeStorage(storageKeys.users, defaultUsers);
  }

  if (!localStorage.getItem(storageKeys.carts)) {
    writeStorage(storageKeys.carts, {});
  }

  if (!localStorage.getItem(storageKeys.orders)) {
    writeStorage(storageKeys.orders, []);
  }
}

function getUsers() {
  return readStorage(storageKeys.users, defaultUsers);
}

function getSession() {
  return readStorage(storageKeys.session, null);
}

function setSession(session) {
  if (!session) {
    localStorage.removeItem(storageKeys.session);
    return;
  }

  writeStorage(storageKeys.session, session);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) {
    return null;
  }

  return getUsers().find((user) => user.email === session.email) || null;
}

function getCarts() {
  return readStorage(storageKeys.carts, {});
}

function getCurrentCart() {
  const user = getCurrentUser();
  if (!user) {
    return [];
  }

  const carts = getCarts();
  return carts[user.email] || [];
}

function saveCurrentCart(items) {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  const carts = getCarts();
  carts[user.email] = items;
  writeStorage(storageKeys.carts, carts);
}

function currency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function cartItemCount() {
  return getCurrentCart().reduce((total, item) => total + item.quantity, 0);
}

function cartTotal() {
  return getCurrentCart().reduce((total, item) => total + item.quantity * item.price, 0);
}

function updateHeader() {
  const currentUser = getCurrentUser();
  const userBadge = document.querySelector('[data-testid="current-user"]');
  const cartBadge = document.querySelector('[data-testid="cart-badge"]');
  const logoutButton = document.querySelector('[data-testid="logout-button"]');

  if (userBadge) {
    userBadge.textContent = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : 'Visitante';
  }

  if (cartBadge) {
    cartBadge.textContent = String(cartItemCount());
  }

  if (logoutButton) {
    logoutButton.hidden = !currentUser;
    logoutButton.onclick = () => {
      setSession(null);
      updateHeader();
      window.location.href = '/login.html';
    };
  }
}

function setFeedback(element, type, message) {
  if (!element) {
    return;
  }

  element.className = `alert ${type}`;
  element.textContent = message;
  element.hidden = false;
}

function setupLoginPage() {
  const form = document.querySelector('[data-testid="login-form"]');
  if (!form) {
    return;
  }

  const feedback = document.querySelector('[data-testid="login-feedback"]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get('email') || '')
      .trim()
      .toLowerCase();
    const password = String(formData.get('password') || '');
    const user = getUsers().find((item) => item.email === email && item.password === password);

    if (!user) {
      setFeedback(feedback, 'error', 'Credenciais inválidas. Revise e tente novamente.');
      return;
    }

    setSession({ email: user.email });
    setFeedback(
      feedback,
      'success',
      'Login realizado com sucesso. Redirecionando para produtos...',
    );
    updateHeader();
    window.setTimeout(() => {
      window.location.href = '/products.html';
    }, 150);
  });
}

function setupRegisterPage() {
  const form = document.querySelector('[data-testid="register-form"]');
  if (!form) {
    return;
  }

  const feedback = document.querySelector('[data-testid="register-feedback"]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const candidate = {
      firstName: String(formData.get('firstName') || '').trim(),
      lastName: String(formData.get('lastName') || '').trim(),
      email: String(formData.get('email') || '')
        .trim()
        .toLowerCase(),
      password: String(formData.get('password') || ''),
    };

    if (candidate.password.length < 8) {
      setFeedback(feedback, 'error', 'A senha deve possuir pelo menos 8 caracteres.');
      return;
    }

    const users = getUsers();
    if (users.some((user) => user.email === candidate.email)) {
      setFeedback(feedback, 'error', 'Já existe um usuário cadastrado com esse e-mail.');
      return;
    }

    users.push(candidate);
    writeStorage(storageKeys.users, users);
    setSession({ email: candidate.email });
    setFeedback(
      feedback,
      'success',
      'Cadastro realizado com sucesso. Sua conta já está autenticada.',
    );
    updateHeader();
    window.setTimeout(() => {
      window.location.href = '/products.html';
    }, 150);
  });
}

function createProductCard(product) {
  return `
    <article class="product-card" data-testid="product-card" data-product-name="${product.name}">
      <span class="badge">${product.category}</span>
      <h3>${product.name}</h3>
      <p class="product-meta">Produto demo para cobrir busca, carrinho e checkout.</p>
      <p class="price">${currency(product.price)}</p>
      <button type="button" data-testid="add-to-cart-${product.id}">Adicionar ao carrinho</button>
    </article>
  `;
}

function setupProductsPage() {
  const container = document.querySelector('[data-testid="products-grid"]');
  if (!container) {
    return;
  }

  const searchInput = document.querySelector('[data-testid="search-input"]');
  const feedback = document.querySelector('[data-testid="products-feedback"]');
  const currentUser = getCurrentUser();

  function renderProducts(query = '') {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = catalog.filter((product) => {
      const searchable = `${product.name} ${product.category}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });

    container.innerHTML = filtered.length
      ? filtered.map(createProductCard).join('')
      : '<div class="empty-state" data-testid="empty-search">Nenhum produto encontrado.</div>';

    container.querySelectorAll('button[data-testid^="add-to-cart-"]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!currentUser) {
          setFeedback(feedback, 'error', 'Faça login para adicionar itens ao carrinho.');
          return;
        }

        const productId = button.getAttribute('data-testid')?.replace('add-to-cart-', '');
        const product = catalog.find((item) => item.id === productId);

        if (!product) {
          return;
        }

        const cart = getCurrentCart();
        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        saveCurrentCart(cart);
        updateHeader();
        setFeedback(feedback, 'success', `${product.name} foi adicionado ao carrinho.`);
      });
    });
  }

  searchInput?.addEventListener('input', (event) => {
    renderProducts(event.target.value);
  });

  renderProducts();
}

function setupCartPage() {
  const tableBody = document.querySelector('[data-testid="cart-items"]');
  if (!tableBody) {
    return;
  }

  const total = document.querySelector('[data-testid="cart-total"]');
  const checkoutButton = document.querySelector('[data-testid="go-to-checkout"]');
  const cart = getCurrentCart();

  if (!cart.length) {
    tableBody.innerHTML =
      '<tr><td colspan="4" class="empty-state">Seu carrinho está vazio.</td></tr>';
    if (checkoutButton) {
      checkoutButton.setAttribute('aria-disabled', 'true');
    }
  } else {
    tableBody.innerHTML = cart
      .map(
        (item) => `
          <tr data-testid="cart-row">
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${currency(item.price)}</td>
            <td>${currency(item.quantity * item.price)}</td>
          </tr>
        `,
      )
      .join('');
  }

  if (total) {
    total.textContent = currency(cartTotal());
  }
}

function setupCheckoutPage() {
  const form = document.querySelector('[data-testid="checkout-form"]');
  if (!form) {
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  const summary = document.querySelector('[data-testid="checkout-summary"]');
  const feedback = document.querySelector('[data-testid="checkout-feedback"]');
  const confirmation = document.querySelector('[data-testid="order-confirmation"]');
  const cart = getCurrentCart();

  if (!cart.length) {
    setFeedback(feedback, 'error', 'Adicione produtos ao carrinho antes de concluir o checkout.');
    return;
  }

  if (summary) {
    summary.innerHTML = `
      <ul>
        ${cart
          .map(
            (item) =>
              `<li>${item.name} x ${item.quantity} — <strong>${currency(item.quantity * item.price)}</strong></li>`,
          )
          .join('')}
      </ul>
      <p><strong>Total:</strong> ${currency(cartTotal())}</p>
    `;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const order = {
      customer: user.email,
      fullName: String(formData.get('fullName') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      cardNumber: String(formData.get('cardNumber') || '').trim(),
      total: cartTotal(),
      items: cart,
      createdAt: new Date().toISOString(),
    };

    if (order.cardNumber.length < 16) {
      setFeedback(feedback, 'error', 'Informe um cartão com 16 dígitos para concluir o pedido.');
      return;
    }

    const orders = readStorage(storageKeys.orders, []);
    orders.push(order);
    writeStorage(storageKeys.orders, orders);
    saveCurrentCart([]);
    updateHeader();
    setFeedback(feedback, 'success', 'Pedido realizado com sucesso.');

    if (confirmation) {
      confirmation.hidden = false;
      confirmation.innerHTML = `
        <h3>Pedido confirmado</h3>
        <p>Cliente: <strong>${order.fullName}</strong></p>
        <p>Total aprovado: <strong>${currency(order.total)}</strong></p>
      `;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeStore();
  updateHeader();
  setupLoginPage();
  setupRegisterPage();
  setupProductsPage();
  setupCartPage();
  setupCheckoutPage();
});
