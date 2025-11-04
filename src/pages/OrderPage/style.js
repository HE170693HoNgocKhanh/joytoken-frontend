import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 3rem 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 0.5rem;
  }
`;

export const CheckoutWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

export const RightSection = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  height: fit-content;
  position: sticky;
  top: 2rem;
  align-self: flex-start;

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
    order: -1;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #111827;
  }
`;

export const SectionCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  margin-bottom: 0;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 1.25rem;
  }
`;

export const IconWrapper = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  color: #3b82f6;
  margin-right: 0.5rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #fff;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  background: #fff;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const PaymentMethodGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PaymentOption = styled.label`
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border: 2px solid ${(props) => (props.active ? "#3b82f6" : "#e5e7eb")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.active ? "#eff6ff" : "#fff")};

  &:hover {
    border-color: ${(props) => (props.active ? "#3b82f6" : "#d1d5db")};
    background: ${(props) => (props.active ? "#eff6ff" : "#f9fafb")};
  }

  input[type="radio"] {
    margin-right: 1rem;
    margin-top: 0.25rem;
    cursor: pointer;
    width: 20px;
    height: 20px;
    accent-color: #3b82f6;
  }

  > div {
    flex: 1;

    label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      margin-bottom: 0.5rem;

      .payment-icon {
        font-size: 1.25rem;
        margin-right: 0.5rem;
        display: flex;
        align-items: center;
        color: #3b82f6;
      }

      .payment-label {
        font-weight: 500;
        color: #111827;
        font-size: 0.875rem;
      }

      .payment-badge {
        margin-left: auto;
        padding: 0.25rem 0.75rem;
        background: #d1fae5;
        color: #065f46;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }

    p {
      margin: 0;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
      padding-left: 2.25rem;
    }
  }
`;

export const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  .order-items {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 1.5rem;
  }

  .pricing-breakdown {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }
`;

export const OrderItem = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;

  .item-image {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    background: #e5e7eb;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-info {
    flex: 1;
    min-width: 0;

    .item-name {
      font-weight: 500;
      margin-bottom: 0.125rem;
      color: #111827;
      font-size: 0.875rem;
      word-wrap: break-word;
    }

    .item-variant {
      font-size: 0.75rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .item-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-top: 0.5rem;

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        overflow: hidden;
        background: #fff;

        .qty-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          color: #374151;
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;

          &:hover:not(:disabled) {
            background: #e5e7eb;
            color: #111827;
          }

          &:active:not(:disabled) {
            transform: scale(0.95);
          }

          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          &.minus {
            border-right: 1px solid #e5e7eb;
          }

          &.plus {
            border-left: 1px solid #e5e7eb;
          }
        }

        .qty-value {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: #111827;
          font-size: 0.9375rem;
        }
      }

      .item-price {
        font-weight: 600;
        color: #3b82f6;
        font-size: 0.875rem;
        white-space: nowrap;
      }
    }
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;

  span:first-child {
    color: #6b7280;
  }

  span:last-child {
    color: #111827;
    font-weight: 500;
  }
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 1.125rem;
  font-weight: 700;

  span:first-child {
    color: #111827;
  }

  span:last-child {
    color: #3b82f6;
    font-size: 1.25rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const BackButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #e5e7eb;
  }
`;

export const SubmitButton = styled.button`
  flex: 2;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const EmptyStateContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;

  h2 {
    color: #1f2937;
    margin-bottom: 1rem;
    font-size: 1.875rem;
    font-weight: 700;
  }

  p {
    color: #6b7280;
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  button {
    padding: 0.875rem 2rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
  }
`;
