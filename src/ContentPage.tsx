import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DonateForm from './DonateForm';

interface Content {
  Title: string;
  Poster: string;
  imdbRating: string;
  Plot: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Language: string;
  Country: string;
  Awards: string;
  ImdbRatings: string;
  Metascore: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}

const ContentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Получаем imdbID из параметров маршрута

  const [content, setContent] = useState<Content | null>(null);
  const [showDonateForm, setShowDonateForm] = useState(false); // Состояние для отображения формы Donate

  // Mock функция для получения данных контента (заменить на ваш реальный запрос)
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=e55bdc80`); // Используем imdbID для запроса информации о контенте
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Заполняем данные контента полученные из API
        setContent({
          Title: data.Title,
          Poster: data.Poster,
          imdbRating: data.imdbRating,
          Plot: data.Plot,
          Year: data.Year,
          Rated: data.Rated,
          Released: data.Released,
          Runtime: data.Runtime,
          Genre: data.Genre,
          Director: data.Director,
          Writer: data.Writer,
          Actors: data.Actors,
          Language: data.Language,
          Country: data.Country,
          Awards: data.Awards,
          ImdbRatings: data.ImdbRatings,
          Metascore: data.Metascore,
          imdbVotes: data.imdbVotes,
          imdbID: data.imdbID,
          Type: data.Type,
          DVD: data.DVD,
          BoxOffice: data.BoxOffice,
          Production: data.Production,
          Website: data.Website,
        });
      } catch (error) {
        console.error('Error fetching content:', error);
        // В случае ошибки можно направить пользователя на страницу поиска или другую обработку
        navigate('/search');
      }
    };

    fetchContent();
  }, [id, navigate]);

  const handleDonate = () => {
    setShowDonateForm(true);
  };

  const handleBackToSearch = () => {
    navigate('/search');
  };

  if (!content) {
    return <p>Loading...</p>; // Можно добавить загрузочный экран пока данные загружаются
  }

  return (
    <div className="content-page">
      {!showDonateForm && (
        <>
          <div className="img-wrapper">
            <img src={content.Poster} alt={content.Title} />
          </div>
          <div>
            <h2>{content.Title} ({content.Year})</h2>
            <div className="about">
              <h4>About</h4>
              <div className="info-text-wrapper">
                <div className="rating">
                  IMDB Rating:
                  <p>{content.imdbRating}</p>
                </div>
                <div className="plot">
                  <p><strong>Plot:</strong> {content.Plot}</p>
                </div>
                <div className="genre">
                  <p><strong>Genre:</strong> {content.Genre}</p>
                </div>
                <div className="director">
                  <p><strong>Director:</strong> {content.Director}</p>
                </div>
              </div>
              <h4>Other info</h4>
              <div className="info-text-wrapper">
                <div className="details">
                  <p><strong>Rated:</strong> {content.Rated}</p>
                </div>
                <div className="details">
                  <p><strong>Released:</strong> {content.Released}</p>
                </div>
                <div className="details">
                  <p><strong>Runtime:</strong> {content.Runtime}</p>
                </div>
                <div className="details">
                  <p><strong>Writer:</strong> {content.Writer}</p>
                </div>
                <div className="details">
                  <p><strong>Actors:</strong> {content.Actors}</p>
                </div>
                <div className="details">
                  <p><strong>Language:</strong> {content.Language}</p>
                </div>
                <div className="details">
                  <p><strong>Country:</strong> {content.Country}</p>
                </div>
                <div className="details">
                  <p><strong>Awards:</strong> {content.Awards}</p>
                </div>
                <div className="details">
                  <p><strong>Metascore:</strong> {content.Metascore}</p>
                </div>
                <div className="details">
                  <p><strong>imdbVotes:</strong> {content.imdbVotes}</p>
                </div>
                <div className="details">
                  <p><strong>Type:</strong> {content.Type}</p>
                </div>
              </div>
            </div>
            <div className="buttons">
              <button className="back-to-search" onClick={handleBackToSearch}>Back to Search</button>
              <button className="to-donate-button" onClick={handleDonate}>Donate</button>
            </div>
          </div>
        </>
      )}

      {showDonateForm && (
        <DonateForm
          contentTitle={content.Title}
          poster={content.Poster}
          year={content.Year}
          director={content.Director}
          onClose={() => setShowDonateForm(false)}
        />
      )}
    </div>
  );
};

export default ContentPage;
