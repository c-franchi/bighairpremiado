// // server.js
// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const cors = require('cors');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// let purchasedNumbersGlobal = [];

// // Configuração do transporte do Nodemailer usando o Gmail
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_FROM,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Endpoint para enviar o e-mail de confirmação e atualizar os números comprados
// app.post('/send-email', (req, res) => {
//   const { buyerEmail, selectedNumbers, txHash, totalBNB, priceAtPurchase, currentBNBValue } = req.body;
  
//   // Atualiza a lista de números comprados sem duplicatas
//   purchasedNumbersGlobal = Array.from(new Set([...purchasedNumbersGlobal, ...selectedNumbers]));
  
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: buyerEmail,
//     subject: "Confirmação de Compra - GRD Números Premiados",
//     html: `
//       <h1>Compra Confirmada!</h1>
//       <p><strong>Email:</strong> ${buyerEmail}</p>
//       <p><strong>Números Comprados:</strong> ${selectedNumbers.join(", ")}</p>
//       <p><strong>Total Pago (BNB):</strong> ${totalBNB}</p>
//       <p><strong>Valor do BNB no ato da compra:</strong> $${priceAtPurchase} USD (Fonte: Binance)</p>
//       <p><strong>Valor atual do BNB:</strong> $${parseFloat(currentBNBValue).toFixed(2)} USD (Fonte: Binance)</p>
//       <p><em>Caso a promoção seja cancelada por não atingir 80% dos números, o valor acima será devolvido.</em></p>
//       <p><strong>Hash da Transferência:</strong> ${txHash}</p>
//       <p>Data: ${new Date().toLocaleString()}</p>
//       <p>Agradecemos sua participação!</p>
//     `
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Erro ao enviar o e-mail:", error);
//       return res.status(500).json({ error: "Erro ao enviar o email.", details: error.message });
//     }
//     console.log("E-mail enviado:", info.response);
//     res.status(200).json({ message: "E-mail enviado com sucesso!" });
//   });
// });

// // Endpoint para obter os números já comprados
// app.get('/purchased-numbers', (req, res) => {
//   res.json({ purchasedNumbers: purchasedNumbersGlobal });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));



require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let purchasedNumbersGlobal = [];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', (req, res) => {
  const { buyerEmail, selectedNumbers, txHash, totalBNB, priceAtPurchase, currentBNBValue } = req.body;

  if (!buyerEmail || !selectedNumbers || !txHash || !totalBNB || !priceAtPurchase || !currentBNBValue) {
    return res.status(400).json({ error: "Dados incompletos." });
  }

  purchasedNumbersGlobal = [...new Set([...purchasedNumbersGlobal, ...selectedNumbers])];

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: buyerEmail,
    subject: "Confirmação de Compra - GRD Números Premiados",
    html: `
      <h1>Compra Confirmada!</h1>
      <p><strong>Email:</strong> ${buyerEmail}</p>
      <p><strong>Números Comprados:</strong> ${selectedNumbers.join(", ")}</p>
      <p><strong>Total Pago (BNB):</strong> ${totalBNB}</p>
      <p><strong>Valor do BNB no ato da compra:</strong> $${parseFloat(currentBNBValue).toFixed(2)} USD (Fonte: Binance)</p>
      <p><em>Caso a promoção seja cancelada por não atingir 80% dos números, o valor acima será devolvido.</em></p>
      <p><strong>Hash da Transferência:</strong> ${txHash}</p>
      <p>Data: ${new Date().toLocaleString()}</p>
      <p>Agradecemos sua participação!</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o e-mail:", error);
      return res.status(500).json({ error: "Erro ao enviar o email.", details: error.message });
    }
    console.log("E-mail enviado:", info.response);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  });
});

app.get('/purchased-numbers', (req, res) => {
  res.json({ purchasedNumbers: purchasedNumbersGlobal });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));