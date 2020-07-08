import React from 'react';
import { Link } from 'react-router-dom';
import friendlyTime from './../../utils/friendlyTime';
import avatar from '../../img/no-avatar.png';

const PostBox = ({ post }) => {
  const { content, createdAt, images, user } = post;

  const contentclassName = `post__box--content${
    images.length > 0 ? '' : '-only'
  }`;

  return (
    <div>
      <div className="post__box">
        {images.length > 0 && (
          <div className="post__box--image">
            <img src={images[0].location} alt="Post image" />
          </div>
        )}

        <div className={contentclassName}>
          <div className="post__box--content-header">
            <Link to={`/${user.link}`} className="post__box--author">
              <div className="post__box--author-img">
                <img
                  src={(user.image && user.image.location) || avatar}
                  alt="Author image"
                />
              </div>
              <span className="post__box--author-name">{user.username}</span>
            </Link>

            <span className="post__box--at">{friendlyTime(createdAt)}</span>

            <Link to="" className="post__box--action">
              <i className="icon-md ri-more-fill"></i>
            </Link>
          </div>

          <div className="post__box--content-info">{content}</div>

          <div className="post__box--content-actions">
            <div className="post__box--actions-part">
              <Link to="" className="post__box--action post__box--action-like">
                <i className="icon ri-heart-line"></i>
                <span>152</span>
              </Link>
              <Link
                to=""
                className="post__box--action post__box--action-comment"
              >
                <i className="icon ri-message-3-line"></i>
                <span>14</span>
              </Link>
              <Link to="" className="post__box--action post__box--action-share">
                <i className="icon ri-share-forward-line"></i>
                <span>7</span>
              </Link>
            </div>

            <Link to="" className="post__box--action">
              <i className="icon ri-fullscreen-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
