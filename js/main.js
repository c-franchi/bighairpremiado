  document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = "http://localhost:3000";
  
    const totalNumbers = 500;
    const numberGrid = document.getElementById("numberGrid");
    const proceedButton = document.getElementById("proceedButton");
    const priceBNBElem = document.getElementById("priceBNB");
    const totalBNBElem = document.getElementById("totalBNB");
    const paymentSection = document.getElementById("paymentSection");
    const selectionSection = document.getElementById("selectionSection");
    const copyButton = document.getElementById("copyButton");
    const txHashSection = document.getElementById("txHashSection");
    const emailSection = document.getElementById("emailSection");
    const confirmButton = document.getElementById("confirmButton");
    const backButton = document.getElementById("backButton");
    const confirmationSection = document.getElementById("confirmationSection");
    const purchasedNumbersElem = document.getElementById("purchasedNumbers");
    const soldPercentageElem = document.getElementById("soldPercentage");
    const deselect10Button = document.getElementById("deselect10Button");
    const clearSelectionButton = document.getElementById("clearSelectionButton");
    const selectionSummary = document.getElementById("selectionSummary");
  
    const seqSelectButton = document.getElementById("seqSelectButton");
    const randSelectButton = document.getElementById("randSelectButton");
  
    const fixedPricePerNumber = 0.34 / 500;
    let currentBNBValue = 0;
    let paymentTimerId = null;
    const walletAddress = "0x5Ab15d869aF92db6e02d81B1449B4b057640177E";
    document.getElementById("walletAddress").value = walletAddress;
  
    function atualizarDisplayPreco() {
      priceBNBElem.textContent = fixedPricePerNumber.toFixed(6) + " BNB";
      const pricePerNumberUSD = fixedPricePerNumber * currentBNBValue;
      const priceUSDValueElem = document.getElementById("priceUSDValue");
      if (priceUSDValueElem) {
        priceUSDValueElem.textContent = "Valor por número em USD: $" + pricePerNumberUSD.toFixed(2) + " USD";
      }
      const bnbCurrentValueElem = document.getElementById("bnbCurrentValue");
      if (bnbCurrentValueElem) {
        bnbCurrentValueElem.textContent = `Valor atual do BNB: $${currentBNBValue.toFixed(2)} USD (Fonte: Binance)`;
      }
      updateSelectedCount();
    }
  
    function updateBNBPriceWrapper() {
      fetchBNBPrice().then(price => {
        if (price !== null) {
          currentBNBValue = price;
          console.log("Preço atualizado via fetchBNBPrice():", currentBNBValue);
        } else {
          console.error("fetchBNBPrice() retornou null. Usando valor fallback 300.");
          currentBNBValue = 300;
        }
        atualizarDisplayPreco();
        checkAndRetryBNBPrice();
      }).catch(error => {
        console.error("Erro em updateBNBPriceWrapper:", error);
        currentBNBValue = 300;
        atualizarDisplayPreco();
        checkAndRetryBNBPrice();
      });
    }
  
    function checkAndRetryBNBPrice() {
      if (currentBNBValue === 300) {
        console.warn("Preço fallback detectado (300). Tentando atualizar novamente em 5 segundos...");
        Swal.fire({
          title: 'Atualizando preço...',
          text: 'Não foi possível obter a cotação atual do BNB. Tentando novamente em 5 segundos.',
          icon: 'info',
          timer: 5000,
          showConfirmButton: false
        });
        setTimeout(updateBNBPriceWrapper, 5000);
      }
    }
  
    updateBNBPriceWrapper();
    setInterval(updateBNBPriceWrapper, 60000);
  
    let selectedNumbers = [];
    let purchasedNumbers = [];
  
    function updateSelectedCount() {
      const count = selectedNumbers.length;
      const totalBNBForSelection = (count * fixedPricePerNumber).toFixed(6);
      const totalUSDForSelection = (count * fixedPricePerNumber * currentBNBValue).toFixed(2);
      selectionSummary.innerHTML = `<p>Você selecionou <span id="selectedCount">${count}</span> número(s).</p>
                                    <p style="text-align: right;">Total da compra: ${totalBNBForSelection} BNB ($${totalUSDForSelection} USD)</p>`;
      proceedButton.disabled = count === 0;
    }
  
    function updateSoldPercentage(purchasedCount) {
      const percentage = (purchasedCount / totalNumbers) * 100;
      soldPercentageElem.textContent = `Vendidos: ${percentage.toFixed(2)}%`;
    }
  
    function markNumber(num) {
      const btn = document.querySelector(`button[data-number="${num}"]`);
      if (btn && !btn.classList.contains("selected") && !btn.classList.contains("purchased")) {
        selectedNumbers.push(num);
        btn.classList.add("selected");
      }
    }
  
    for (let i = 1; i <= totalNumbers; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.dataset.number = i;
      btn.addEventListener("click", function() {
        if (btn.classList.contains("purchased")) return;
        const num = parseInt(btn.dataset.number);
        if (selectedNumbers.includes(num)) {
          selectedNumbers = selectedNumbers.filter(n => n !== num);
          btn.classList.remove("selected");
        } else {
          selectedNumbers.push(num);
          btn.classList.add("selected");
        }
        updateSelectedCount();
      });
      numberGrid.appendChild(btn);
    }
  
    function selectSequentially() {
      let count = 0;
      for (let i = 1; i <= totalNumbers && count < 10; i++) {
        const btn = document.querySelector(`button[data-number="${i}"]`);
        if (btn && !btn.classList.contains("purchased") && !selectedNumbers.includes(i)) {
          markNumber(i);
          count++;
        }
      }
      updateSelectedCount();
    }
  
    function selectRandomly() {
      const available = [];
      for (let i = 1; i <= totalNumbers; i++) {
        const btn = document.querySelector(`button[data-number="${i}"]`);
        if (btn && !btn.classList.contains("purchased") && !selectedNumbers.includes(i)) {
          available.push(i);
        }
      }
      available.sort(() => 0.5 - Math.random());
      const toSelect = available.slice(0, 10);
      toSelect.forEach(num => markNumber(num));
      updateSelectedCount();
    }
  
    seqSelectButton.addEventListener("click", selectSequentially);
    randSelectButton.addEventListener("click", selectRandomly);
  
    if (deselect10Button) {
      deselect10Button.addEventListener("click", function() {
        if (selectedNumbers.length === 0) return;
        const removeCount = Math.min(10, selectedNumbers.length);
        for (let i = 0; i < removeCount; i++) {
          const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
          const numToRemove = selectedNumbers[randomIndex];
          selectedNumbers = selectedNumbers.filter(n => n !== numToRemove);
          const btn = document.querySelector(`button[data-number="${numToRemove}"]`);
          if (btn) {
            btn.classList.remove("selected");
          }
        }
        updateSelectedCount();
      });
    }
  
    if (clearSelectionButton) {
      clearSelectionButton.addEventListener("click", function() {
        selectedNumbers.forEach(num => {
          const btn = document.querySelector(`button[data-number="${num}"]`);
          if (btn) {
            btn.classList.remove("selected");
          }
        });
        selectedNumbers = [];
        updateSelectedCount();
      });
    }
  
    if (backButton) {
      backButton.addEventListener("click", function() {
        if (paymentTimerId) clearTimeout(paymentTimerId);
        paymentSection.style.display = "none";
        selectionSection.style.display = "block";
      });
    }
  
    function startPaymentTimer() {
      paymentTimerId = setTimeout(() => {
        Swal.fire("Tempo Esgotado", "O tempo para realizar o pagamento expirou. Por favor, refaça sua seleção.", "warning")
          .then(() => window.location.reload());
      }, 300000);
    }
  
    function proceedToPayment() {
      selectionSection.style.display = "none";
      paymentSection.style.display = "block";
      const totalBNB = (selectedNumbers.length * fixedPricePerNumber).toFixed(6);
      totalBNBElem.textContent = totalBNB;
      startPaymentTimer();
    }
  
    proceedButton.addEventListener("click", function() {
      const totalBNB = (selectedNumbers.length * fixedPricePerNumber).toFixed(6);
      if (totalBNB > 0.75) {
        Swal.fire({
          title: 'Atenção',
          text: `O valor total da compra é ${totalBNB} BNB, que é maior que 0,75 BNB (valor vendido pela plataforma Gold Reserve). Deseja continuar?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim, continuar',
          cancelButtonText: 'Não, voltar à seleção'
        }).then((result) => {
          if (result.isConfirmed) {
            proceedToPayment();
          } else {
            paymentSection.style.display = "none";
            selectionSection.style.display = "block";
          }
        });
      } else {
        proceedToPayment();
      }
    });
  
    copyButton.addEventListener("click", function() {
      const walletInput = document.getElementById("walletAddress");
      walletInput.select();
      walletInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      Swal.fire('Sucesso', 'Endereço copiado para a área de transferência! Finalize o pagamento em até 5 minutos.', 'success');
      txHashSection.style.display = "block";
      emailSection.style.display = "block";
      confirmButton.style.display = "block";
    });
  
    function generateReceiptImage(buyerEmail, selectedNumbers, totalBNB, txHash, priceAtPurchase) {
      const receiptDiv = document.createElement("div");
      receiptDiv.style.width = "400px";
      receiptDiv.style.margin = "20px auto";
      receiptDiv.style.padding = "20px";
      receiptDiv.style.border = "2px solid #333";
      receiptDiv.style.fontFamily = "Arial, sans-serif";
      receiptDiv.style.fontSize = "14px";
      receiptDiv.style.backgroundColor = "#fff";
      receiptDiv.innerHTML = `
        <h2 style="text-align:center; margin-bottom:10px;">GRD Números Premiados</h2>
        <h3 style="text-align:center; margin-bottom:20px;">Comprovante de Compra</h3>
        <p><strong>Email:</strong> ${buyerEmail}</p>
        <p><strong>Números Comprados:</strong> ${selectedNumbers.join(", ")}</p>
        <p><strong>Total Pago (BNB):</strong> ${totalBNB}</p>
        <p><strong>Valor do BNB no ato da compra:</strong> $${priceAtPurchase} USD (Fonte: Binance)</p>
        <p><strong>Hash da Transferência:</strong> ${txHash}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString()}</p>
        <p><em>Caso a promoção seja cancelada por não atingir 80% dos números, o valor acima será devolvido.</em></p>
      `;
      document.body.appendChild(receiptDiv);
  
      html2canvas(receiptDiv).then(canvas => {
        const imageData = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = imageData;
        downloadLink.download = "comprovante.png";
        downloadLink.textContent = "Download Comprovante (Imagem)";
        confirmationSection.appendChild(downloadLink);
        document.body.removeChild(receiptDiv);
      }).catch(error => {
        console.error("Erro ao gerar comprovante:", error);
        Swal.fire('Erro', 'Falha ao gerar o comprovante. Tente novamente.', 'error');
      });
    }
  
    function updateGridWithPurchasedNumbers() {
      fetch(baseUrl + '/purchased-numbers')
        .then(response => response.json())
        .then(data => {
          const purchased = data.purchasedNumbers;
          updateSoldPercentage(purchased.length);
          purchased.forEach(num => {
            const btn = document.querySelector(`button[data-number="${num}"]`);
            if (btn && !btn.classList.contains("purchased")) {
              btn.classList.add("purchased");
              btn.disabled = true;
              if (selectedNumbers.includes(num)) {
                selectedNumbers = selectedNumbers.filter(n => n !== num);
                btn.classList.remove("selected");
                updateSelectedCount();
              }
            }
          });
        })
        .catch(error => {
          console.error("Erro ao obter números comprados:", error);
        });
    }
  
    setInterval(updateGridWithPurchasedNumbers, 3000);
  
    confirmButton.addEventListener("click", function() {
      const txHash = document.getElementById("txHash").value.trim();
      const buyerEmail = document.getElementById("email").value.trim();
      const lgpdConsent = document.getElementById("lgpdConsent").checked;
      const rulesConsent = document.getElementById("rulesConsent").checked;
  
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
        Swal.fire('Atenção', 'Por favor, insira um email válido.', 'warning');
        return;
      }
      if (!txHash) {
        Swal.fire('Atenção', 'Por favor, insira a hash da transferência.', 'warning');
        return;
      }
      if (!buyerEmail) {
        Swal.fire('Atenção', 'Por favor, insira seu email.', 'warning');
        return;
      }
      if (!lgpdConsent) {
        Swal.fire('Atenção', 'Por favor, aceite os termos de privacidade conforme a LGPD.', 'warning');
        return;
      }
      if (!rulesConsent) {
        Swal.fire('Atenção', 'Por favor, aceite as regras da promoção.', 'warning');
        return;
      }
  
      selectedNumbers.forEach(num => {
        purchasedNumbers.push(num);
        const btn = document.querySelector(`button[data-number="${num}"]`);
        if (btn) {
          btn.classList.remove("selected");
          btn.classList.add("purchased");
          btn.disabled = true;
        }
      });
  
      if (paymentTimerId) clearTimeout(paymentTimerId);
  
      const totalBNB = (selectedNumbers.length * fixedPricePerNumber).toFixed(6);
      const priceAtPurchase = fixedPricePerNumber.toFixed(6);
  
      const emailData = {
        buyerEmail: buyerEmail,
        selectedNumbers: selectedNumbers,
        txHash: txHash,
        totalBNB: totalBNB,
        priceAtPurchase: priceAtPurchase,
        currentBNBValue: currentBNBValue.toFixed(2)
      };
  
      console.log("Enviando dados de e-mail:", emailData);
  
      fetch(baseUrl + '/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('SUCCESS!', data);
          Swal.fire('Sucesso', 'Email de confirmação enviado para ' + buyerEmail, 'success')
            .then(() => {
              window.location.reload();
            });
        })
        .catch(error => {
          console.error('FAILED...', error);
          Swal.fire('Erro', 'Falha ao enviar o email. Você pode baixar o comprovante para ter um registro.', 'error');
          generateReceiptImage(buyerEmail, selectedNumbers, totalBNB, txHash, priceAtPurchase);
        });
    });
  });