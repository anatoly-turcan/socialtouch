import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/userContext';
import Time from '../common/time';
import EditPost from './edit';
import PostMore from './more';
import PostComments from './comments';
import PostFull from './full';
import { deletePost } from '../../services/apiService';
import avatar from '../../img/no-avatar.png';

const PostBox = ({ post, refresh }) => {
  const { content, createdAt, image, user, previewLimit, link } = post;
  const { user: currentUser } = useContext(UserContext);
  const [more, setMore] = useState(false);
  const isMine = currentUser.link === user.link;

  const contentClassName = `post__box--content${image ? '' : '-only'}`;

  const handleDelete = async () => {
    const success = await deletePost(link);
    if (success) refresh();
  };

  const handleEdit = () => setMore('edit');
  const handleComments = () => setMore('comments');
  const handleFull = () => setMore('full');

  const handleBack = () => setMore(false);

  if (more)
    return (
      <PostMore goBack={handleBack}>
        {more === 'edit' && (
          <EditPost post={post} refresh={refresh} cancel={handleBack} />
        )}
        {more === 'comments' && <PostComments link={post.link} />}
        {more === 'full' && <PostFull post={post} />}
      </PostMore>
    );

  return (
    <div className="post__box">
      {image && (
        <div className="post__box--image">
          <img src={image.location} alt="Post image" />
        </div>
      )}

      <div className={contentClassName}>
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

          <span className="post__box--at">
            <Time data={createdAt} />
          </span>

          {isMine && (
            <div className="post__box--action clickable dropdown">
              <i className="icon-md ri-more-fill"></i>
              <div className="dropdown-content">
                <div
                  className="dropdown-el clickable d-btn-default"
                  onClick={handleEdit}
                >
                  Edit
                </div>
                <div
                  className="dropdown-el clickable d-btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="post__box--content-message">
          {content.length < previewLimit
            ? content
            : `${content.substring(0, previewLimit)}...`}
        </div>

        <div className="post__box--content-actions">
          <div className="post__box--actions-part">
            <Link to="" className="post__box--action post__box--action-like">
              <i className="icon ri-heart-line"></i>
              <span>152</span>
            </Link>
            <button
              className="post__box--action post__box--action-comment btn-transparent"
              onClick={handleComments}
            >
              <i className="icon ri-message-3-line"></i>
              {/* <span>14</span> */}
            </button>
          </div>

          <button
            className="post__box--action btn-transparent"
            onClick={handleFull}
          >
            <i class="ri-file-list-2-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
