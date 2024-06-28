import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentResultProps {
  success: boolean;
  amountSent?: number; // Опциональная сумма отправленных TON
  contentTitle: string;
  poster: string;
  year: string;
  director: string;
  onBackToSearch: () => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({
  success,
  amountSent,
  contentTitle,
  poster,
  year,
  director,
  onBackToSearch,
}) => {
  const navigate = useNavigate(); // Объявляем navigate для использования при переходе

  const handleBackToSearch = () => {
    navigate('/search'); // Используем navigate для перехода на страницу поиска
  };

  return (
    <div className="payment-result">
      <div className="confirm-info-wrapper">
        <div className="left-part">
          <img className="confirm-poster" src={poster} alt="Poster" />
        </div>
        <div className="right-part">
          <h3>{contentTitle} {year}</h3>
          <p>{director}</p>
        </div>
      </div>
      <h3>{success ? 'Payment Successful!' : 'Payment Failed'}</h3>
      <div className="amount-in-ton">
        {amountSent} TON
      </div>
      {success && amountSent !== undefined ? (
        <p className='success-amount'>
          Your donation was successfully processed.
        </p>
      ) : (
        <p>There was an error processing your donation.</p>
      )}
      <div className="buttons-after-donate">
        {success ? (
          <button className="back-to-search-after-donate" onClick={onBackToSearch}>
            Back to Search
          </button>
        ) : (
          <>
            <button onClick={handleBackToSearch}>Try Again</button>
            <button onClick={onBackToSearch}>Back to Search</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
