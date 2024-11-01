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

const CART = [];

const CART_TOTAL = 0;

// Inicialize os valores iniciais em sessionStorage da primeira vez que o projeto é executado. Isso previne que os valores retornem ao default ao mudar de página
function initializeValues() {
  if (!sessionStorage.getItem("itemQuantities")) {
    sessionStorage.setItem("itemQuantities", JSON.stringify(ITEM_QUANTITIES));
    sessionStorage.setItem("cart", JSON.stringify(CART));
    sessionStorage.setItem("cartTotal", CART_TOTAL);
  }
}

initializeValues();

function reserveItem(item) {
  let currentItemQuantities = JSON.parse(
    sessionStorage.getItem("itemQuantities")
  );
  let currentCart = JSON.parse(sessionStorage.getItem("cart"));
  let currentCartTotal = parseFloat(sessionStorage.getItem("cartTotal"));

  // Verifica se o item ainda possui estoque
  if (currentItemQuantities[item] > 0) {
    // Diminui a quantidade em 1
    currentItemQuantities[item]--;
    // Atualie sessionStorage com o valor atual
    sessionStorage.setItem(
      "itemQuantities",
      JSON.stringify(currentItemQuantities)
    );

    // Adiciona o preço do item ao total do pedido
    currentCartTotal += ITEM_PRICES[item];
    sessionStorage.setItem("cartTotal", currentCartTotal.toFixed(2)); // Armazena o total no sessionStorage

    // Adicionar o item ao array de pedidos
    let cartItem = currentCart.find((c) => c.id === item);
    if (cartItem) {
      cartItem.quantity++;
      cartItem.price += ITEM_PRICES[item];
    } else {
      currentCart.push({
        id: item,
        name: ITEM_NAMES[item],
        quantity: 1,
        price: ITEM_PRICES[item],
      });
    }

    sessionStorage.setItem("cart", JSON.stringify(currentCart));

    // Atualiza a quantidade exibida
    if (window.location.pathname.includes("reserva.html")) {
      renderQuantities();

      // Pergunta ao usuário se deseja continuar reservando ou finalizar
      const continuar = confirm(
        `Você reservou um(a) ${item}. Deseja continuar reservando?`
      );

      // Verifica a resposta do usuário
      if (!continuar) {
        // Se o usuário escolher finalizar, redireciona para a página de cadastro
        window.location.href = "carrinho.html";
      }
    }

    if (window.location.pathname.includes("carrinho.html")) {
      renderCart();
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

  let currentCart = JSON.parse(sessionStorage.getItem("cart"));
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
    // Check if item quantity can be increased/decreased
    let canIncrease =
      JSON.parse(sessionStorage.getItem("itemQuantities"))[item.id] > 0;
    let canDecrease = item.quantity > 1;

    let cartItem = document.createElement("tr");
    cartItem.innerHTML = `
      <td colspan="2">${item.name}</td>
                        <td>$${ITEM_PRICES[item.id].toFixed(2)}</td>
                        <td>
                            <button class="icon-btn" ${
                              canDecrease ? "" : "disabled"
                            }><i class="fa-solid fa-minus"></i></button>
                            ${item.quantity}
                            <button class="icon-btn" ${
                              canIncrease ? "" : "disabled"
                            } onclick="reserveItem('${
      item.id
    }')"><i class="fa-solid fa-plus"></i></button>
                        </td>
                        <td>
                            $${item.price.toFixed(2)}
                            <button class="icon-btn"><i class="fa-solid fa-xmark"></i></button>
                        </td>
    `;
    cartBody.appendChild(cartItem);
  });
  cartTotal.innerHTML = `Total: $${sessionStorage.getItem("cartTotal")}`;
  checkoutBtn.disabled = false;
}

function renderQuantities() {
  let currentItemQuantities = JSON.parse(
    sessionStorage.getItem("itemQuantities")
  );

  for (const [item, quantity] of Object.entries(currentItemQuantities)) {
    document.getElementById(
      `${item}-qty`
    ).textContent = `Quantidade: ${quantity}`;

    // Verifica se a quantidade chegou a zero para desabilitar o botão
    if (currentItemQuantities[item] === 0) {
      const button = document.getElementById(`${item}-btn`);
      button.disabled = true;
      button.textContent = "Indisponível";
      button.style.backgroundColor = "red";
      button.style.color = "white";
    }
  }
}

// Execute função para carregar as quantidades atuais se usuário estiver vendo a página de reserva
if (window.location.pathname.includes("reserva.html")) {
  renderQuantities();
}

// Execute função para carregar o carrinho se usuário estiver vendo a página de carrinho
if (window.location.pathname.includes("carrinho.html")) {
  renderCart();
}
