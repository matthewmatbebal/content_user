import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ContentProps {
  content: {
    Title: string;
    Poster: string;
    imdbRating: string;
    Genre: string;
    imdbID: string;
  };
}

const ContentCard: React.FC<ContentProps> = ({ content }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/content/${content.imdbID}`);
  };

  return (
    <div className="content-card" onClick={handleCardClick}>
      <div className="img">
        <img className="card-img" src={content.Poster} alt={`${content.Title} poster`} />
      </div>
      <div className="card-text">
        <div className="row-text">
          <h4>{content.Title}</h4>
          <p>{content.imdbRating}</p>
        </div>
        <p>Genre: {content.Genre}</p>
      </div>
    </div>
  );
};

export default ContentCard;
