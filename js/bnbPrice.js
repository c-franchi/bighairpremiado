function fetchBNBPrice() {
    console.log("Consultando API da Binance para o preço do BNB...");
  
    return fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.price) {
          const price = parseFloat(data.price);
          console.log("Preço atualizado do BNB:", price);
          return price;
        } else {
          throw new Error("Formato de resposta inválido: " + JSON.stringify(data));
        }
      })
      .catch(error => {
        console.error("Erro ao buscar o preço do BNB:", error);
        Swal.fire({
          title: 'Erro ao obter a cotação!',
          text: 'Não foi possível atualizar o preço do BNB. Tente novamente mais tarde.',
          icon: 'error'
        });
        return null; // Retorna null para indicar falha
      });
  }
  
  window.fetchBNBPrice = fetchBNBPrice;
  