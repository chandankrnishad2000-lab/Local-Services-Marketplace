"use client";

export const PAYMENT_METHODS = [
  { id: "card", label: "Card", description: "Visa, Mastercard, RuPay", icon: "💳" },
  { id: "upi", label: "UPI", description: "GPay, PhonePe, Paytm", icon: "📱" },
  { id: "netbanking", label: "Netbanking", description: "All major Indian banks", icon: "🏦" }
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["id"];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Card",
  upi: "UPI",
  netbanking: "Netbanking"
};

export default function PaymentMethodSelect({
  value,
  onChange,
  disabled = false
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="payment-options" disabled={disabled}>
      <legend>Payment method</legend>
      <div className="payment-option-grid">
        {PAYMENT_METHODS.map((option) => (
          <label
            key={option.id}
            className={`payment-option${value === option.id ? " selected" : ""}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className="payment-option-icon" aria-hidden="true">{option.icon}</span>
            <span className="payment-option-text">
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
