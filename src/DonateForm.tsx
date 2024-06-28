import React, { useState } from 'react';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import PaymentResult from './PaymentResult';
import { useNavigate } from 'react-router-dom';

interface DonateFormProps {
  contentTitle: string;
  poster: string;
  year: string;
  director: string;
  onClose: () => void;
}

const DonateForm: React.FC<DonateFormProps> = ({ contentTitle, poster, year, director, onClose }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentResult, setShowPaymentResult] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();
  const [sentAmount, setSentAmount] = useState<number | undefined>(undefined);

  const handleSubmit = async () => {
    if (!amount.trim()) {
      alert('Please enter a valid amount.');
      return;
    }

    const amountInTON = parseFloat(amount);
    if (isNaN(amountInTON) || amountInTON <= 0) {
      alert('Please enter a valid amount greater than zero.');
      return;
    }

    setLoading(true);

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        messages: [
          {
            address: 'UQC2K6dmlubWuiShyBYq5DpqVWjDRgr02r_U4YrSml-nt7wh',
            amount: `${amountInTON * 1e9}`,
          },
        ],
      });

      setPaymentSuccess(true);
      setSentAmount(amountInTON);
      setShowPaymentResult(true);
    } catch (error) {
      console.error('Error sending transaction:', error);
      setError('Failed to send donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackToSearch = () => {
    navigate('/search');
  };

  return (
    <div className="donate-form">
      <div className="connect-button">
        <TonConnectButton style={{ color: '#fff', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} />
      </div>
      {!showPaymentResult ? (
        <>
          <div className="payment-confirmation-title">
            <h3>Payment Confirmation</h3>
            <p>Please check the correctness of the data about your donation</p>
          </div>

          <div className="confirm-info-wrapper">
            <div className="left-part">
              <img className="confirm-poster" src={poster} alt="Poster" />
            </div>
            <div className="right-part">
              <h3>
                {contentTitle} {year}
              </h3>
              <p>{director}</p>
            </div>
          </div>
          <input
            className="amount"
            type="number"
            step="any"
            placeholder="Enter amount (in TON)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
          <p className="alert">
            You can send a donation directly to the copyright holder of this intellectual property.
          </p>

          <div className="buttons-wrapper-donate">
            <div className="buttons">
              <button className="submit-button" onClick={handleSubmit} disabled={loading}>
                Submit
              </button>
              <button className="cancel-button" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
        </>
      ) : (
        <PaymentResult
          success={paymentSuccess}
          amountSent={sentAmount}
          contentTitle={contentTitle}
          poster={poster}
          year={year}
          director={director}
          onBackToSearch={handleBackToSearch}
        />
      )}
    </div>
  );
};

export default DonateForm;
