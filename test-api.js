// test-api.js
// Se estiver usando Node 18 ou superior, a função fetch já está disponível de forma global.
// Caso contrário, instale o pacote node-fetch com: npm install node-fetch
// e descomente a linha abaixo:
// const fetch = require("node-fetch");

const url = 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT';

console.log("Consultando a API da Binance...");

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Dados recebidos da Binance API:");
    console.log(data);
    // Exibe o preço extraído, se disponível
    if (data && data.price) {
      console.log(`Preço do BNB/USDT: $${parseFloat(data.price).toFixed(2)} USD`);
    } else {
      console.log("Preço não encontrado na resposta.");
    }
  })
  .catch(error => {
    console.error("Erro ao consultar a API:", error);
  });
