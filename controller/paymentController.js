exports.createPaymentIntent = async (req, res) => {
  res.status(201).json({ message: "Create a payment intent" });
};

exports.confirmPayment = async (req, res) => {
  res.status(200).json({ message: "Confirm payment" });
};

exports.handleWebhook = async (req, res) => {
  // Webhooks usually don't send JSON back, just a 200 OK
  res.status(200).send("Webhook received");
};

exports.refundPayment = async (req, res) => {
  res.status(200).json({ message: `Refund payment ${req.params.id}` });
};
