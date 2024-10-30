// Definindo a quantidade e os preços dos itens
const ITEM_QUANTITIES = {
  burger: 10,
  coxinha: 5,
  quibe: 16,
  refri: 30,
  bolo: 20,
  pizza: 15,
  sorvete: 25,
  cupcake: 3,
};

const ITEM_PRICES = {
  burger: 10,
  coxinha: 8,
  quibe: 8,
  refri: 8,
  bolo: 15,
  pizza: 30,
  sorvete: 12,
  cupcake: 18,
};

const ITEM_NAMES = {
  burger: "Burger",
  coxinha: "Coxinha",
  quibe: "Quibe",
  refri: "Refrigerante",
  bolo: "Bolo",
  pizza: "Pizza",
  sorvete: "Sorvete",
  cupcake: "Cupcake",
};

let cart = [];

// Inicialize o total do pedido com o valor armazenado no localStorage ou zero se não houver
let totalPedido = parseFloat(localStorage.getItem("totalPedido")) || 0;

function reserveItem(item) {
  // Verifica se o item ainda possui estoque
  if (ITEM_QUANTITIES[item] > 0) {
    // Diminui a quantidade em 1
    ITEM_QUANTITIES[item]--;

    // Atualiza a quantidade exibida
    document.getElementById(`${item}-qty`).querySelector("span").textContent =
      ITEM_QUANTITIES[item];

    // Verifica se a quantidade chegou a zero para desabilitar o botão
    if (ITEM_QUANTITIES[item] === 0) {
      const button = document.getElementById(`${item}-btn`);
      button.disabled = true;
      button.textContent = "Indisponível";
      button.style.backgroundColor = "red";
      button.style.color = "white";
    }

    // Adiciona o preço do item ao total do pedido
    totalPedido += ITEM_PRICES[item];
    localStorage.setItem("totalPedido", totalPedido.toFixed(2)); // Armazena o total no localStorage

    // Adicionar o item ao array de pedidos
    let cartItem = cart.find((c) => c.id === item);
    if (cartItem) {
      cartItem.quantity++;
      cartItem.price += ITEM_PRICES[item];
    } else {
      cart.push({
        id: item,
        name: ITEM_NAMES[item],
        quantity: 1,
        price: ITEM_PRICES[item],
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Pergunta ao usuário se deseja continuar reservando ou finalizar
    const continuar = confirm(
      `Você reservou um(a) ${item}. Deseja continuar reservando?`
    );

    // Verifica a resposta do usuário
    if (!continuar) {
      // Se o usuário escolher finalizar, redireciona para a página de cadastro
      window.location.href = "carrinho.html";
    }
  } else {
    alert(`Desculpe, ${item} está indisponível.`);
  }
}

function renderCart() {
  // Get elements from the cart page
  const cartBody = document.getElementById("cart-body");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartBody.innerHTML = "";
  cartTotal.innerHTML = "";
  checkoutBtn.disabled = true;

  let currentCart = JSON.parse(localStorage.getItem("cart"));
  // If no items are in the cart
  if (currentCart.length === 0) {
    cartBody.innerHTML = `
        <tr>
            <td colspan="2">Seu carrinho está vazio</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `;
    return;
  }

  // If there are items in the cart, load each one onto the table
  currentCart.forEach((item) => {
    const cartItem = document.createElement("tr");
    cartItem.innerHTML = `
      <td colspan="2">${item.name}</td>
                        <td>$${ITEM_PRICES[item.id].toFixed(2)}</td>
                        <td>
                            <button class="icon-btn"><i class="fa-solid fa-minus"></i></button>
                            ${item.quantity}
                            <button class="icon-btn"><i class="fa-solid fa-plus"></i></button>
                        </td>
                        <td>
                            $${item.price.toFixed(2)}
                            <button class="icon-btn"><i class="fa-solid fa-xmark"></i></button>
                        </td>
    `;
    cartBody.appendChild(cartItem);
  });
  cartTotal.innerHTML = `Total: $${localStorage.getItem("totalPedido")}`;
  checkoutBtn.disabled = false;
}

// Execute script to load items into the cart if user is visiting the cart page
if (window.location.pathname.includes("carrinho.html")) {
  renderCart();
}
