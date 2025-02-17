const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  const { buyerEmail, selectedNumbers, txHash, totalBNB, priceAtPurchase, currentBNBValue } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: buyerEmail,
    subject: "Confirmação de Compra - GRD Números Premiados",
    html: `
      <h1>Compra Confirmada!</h1>
      <p><strong>Email:</strong> ${buyerEmail}</p>
      <p><strong>Números Comprados:</strong> ${selectedNumbers.join(", ")}</p>
      <p><strong>Total Pago (BNB):</strong> ${totalBNB}</p>
      <p><strong>Valor do BNB no ato da compra:</strong> $${priceAtPurchase} USD (Fonte: Binance)</p>
      <p><strong>Valor atual do BNB:</strong> $${parseFloat(currentBNBValue).toFixed(2)} USD (Fonte: Binance)</p>
      <p><em>Caso a promoção seja cancelada por não atingir 80% dos números, o valor acima será devolvido.</em></p>
      <p><strong>Hash da Transferência:</strong> ${txHash}</p>
      <p>Data: ${new Date().toLocaleString()}</p>
      <p>Agradecemos sua participação!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    res.status(500).json({ error: "Erro ao enviar o email.", details: error.message });
  }
};