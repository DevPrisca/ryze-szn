import { useState } from "react";
import { BANK_TRANSFER, formatPrice } from "../config.js";

function BankTransferDetails({ amount, orderId }) {
  const [copyMessage, setCopyMessage] = useState("");

  async function copyAccountNumber() {
    if (!navigator.clipboard) {
      setCopyMessage("Copy is unavailable here. Select the account number and copy it.");
      return;
    }

    try {
      await navigator.clipboard.writeText(BANK_TRANSFER.accountNumber);
      setCopyMessage("Account number copied.");
    } catch (error) {
      setCopyMessage("Could not copy automatically. Select the account number and copy it.");
    }
  }

  return (
    <div className="bank-transfer-details">
      <h3>Bank transfer</h3>
      <p>Transfer exactly <strong>{formatPrice(amount)}</strong> to:</p>
      <p>
        <strong>Bank:</strong> {BANK_TRANSFER.bank}<br />
        <strong>Account name:</strong> {BANK_TRANSFER.accountName}<br />
        <strong>Account number:</strong> <span className="bank-account-number">{BANK_TRANSFER.accountNumber}</span>
      </p>
      <button className="btn btn-outline copy-account-btn" type="button" onClick={copyAccountNumber}>
        Copy account number
      </button>
      <p className="bank-transfer-copy-status" aria-live="polite">{copyMessage}</p>
      <p className="bank-transfer-reference">
        {orderId
          ? "Use order " + orderId + " as your transfer reference."
          : "After placing your order, use its order number as your transfer reference."}
      </p>
      {orderId && <p>After transferring, send your payment receipt to us on WhatsApp.</p>}
    </div>
  );
}

export default BankTransferDetails;
