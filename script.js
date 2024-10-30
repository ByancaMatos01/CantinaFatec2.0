// Definindo a quantidade e os preços dos itens
const itemQuantities = {
    burger: 10,
    coxinha: 8,
    quibe: 16,
    refri: 30,
    bolo: 20,
    pizza: 15,
    sorvete: 25,
    cupcake: 3  
};

const itemPrices = {
    burger: 10,
    coxinha: 8,
    quibe: 8,
    refri: 8,
    bolo: 15,
    pizza: 30,
    sorvete: 12,
    cupcake: 18
};

// Inicialize o total do pedido com o valor armazenado no localStorage ou zero se não houver
let totalPedido = parseFloat(localStorage.getItem('totalPedido')) || 0;

function reserveItem(item) {
    // Verifica se o item ainda possui estoque
    if (itemQuantities[item] > 0) {
        // Diminui a quantidade em 1
        itemQuantities[item]--;

        // Atualiza a quantidade exibida
        document.getElementById(`${item}-qty`).querySelector('span').textContent = itemQuantities[item];

        // Verifica se a quantidade chegou a zero para desabilitar o botão
        if (itemQuantities[item] === 0) {
            const button = document.getElementById(`${item}-btn`);
            button.disabled = true;
            button.textContent = 'Indisponível';
            button.style.backgroundColor = 'red';
            button.style.color = 'white';
        }

        // Adiciona o preço do item ao total do pedido
        totalPedido += itemPrices[item];
        localStorage.setItem('totalPedido', totalPedido.toFixed(2)); // Armazena o total no localStorage

        // Pergunta ao usuário se deseja continuar reservando ou finalizar
        const continuar = confirm(`Você reservou um(a) ${item}. Deseja continuar reservando?`);

        // Verifica a resposta do usuário
        if (!continuar) {
            // Se o usuário escolher finalizar, redireciona para a página de cadastro
            window.location.href = 'cadastro.html';
        }
    } else {
        alert(`Desculpe, ${item} está indisponível.`);
    }
}
