import React from 'react';
import './trendingItem.css';
const TrendingItem = ({ title }) => {
  return (
    <div className="trending-item">
      <p>{title}</p>
    </div>
  );
};

export default TrendingItem;