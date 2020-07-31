import React from 'react';
import Posts from '../components/posts';
import { getNews } from '../services/apiService';

const News = () => {
  const fetchNews = (page, limit = 10) => getNews(page, limit);

  return (
    <div className="content__news">
      <div className="content__title">News</div>
      <Posts fetchMethod={fetchNews} isMe={false} />
    </div>
  );
};

export default News;
