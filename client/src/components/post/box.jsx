import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from '../../context/userContext';
import Time from '../common/time';
import EditPost from './edit';
import PostMore from './more';
import PostComments from './comments';
import PostFull from './full';
import { deleteGroupPost } from '../../services/groupService';
import { deletePost } from '../../services/postService';
import avatar from '../../img/no-avatar.png';
import noGroup from '../../img/no-group.png';

const PostBox = ({ post, refresh }) => {
  const { content, createdAt, image, user, group, previewLimit } = post;
  const { user: currentUser } = useContext(UserContext);
  const [more, setMore] = useState(false);
  const author = group || user;
  const isMine = group
    ? group.isMine || false
    : currentUser.link === author.link;

  const contentClassName = `post__box--content${image ? '' : '-only'}`;

  const handleDelete = async () => {
    try {
      const deleteMethod = () =>
        post.group
          ? deleteGroupPost(post.group.link, post.link)
          : deletePost(post.link);

      const success = await deleteMethod();
      if (success) refresh();
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
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
          <img src={image.location} alt="Post" />
        </div>
      )}

      <div className={contentClassName}>
        <div className="post__box--content-header">
          <Link
            to={group ? `/group/${author.link}` : `/${author.link}`}
            className="post__box--author"
          >
            <div className="post__box--author-img">
              <img
                src={
                  group
                    ? author.image?.location || noGroup
                    : author.image?.location || avatar
                }
                alt="Author"
              />
            </div>
            <span className="post__box--author-name">
              {author.username || author.name}
            </span>
          </Link>

          <span className="post__box--at">
            <Time data={createdAt} />
          </span>

          {isMine && (
            <div className="post__box--action clickable dropdown">
              <i className="icon-md ri-more-fill" />
              <div className="dropdown-content">
                <button
                  type="button"
                  className="dropdown-el clickable d-btn-default"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="dropdown-el clickable d-btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
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
            <button
              type="button"
              className="post__box--action post__box--action-comment btn-transparent"
              onClick={handleComments}
            >
              <i className="icon ri-message-3-line" />
            </button>
          </div>

          <button
            type="button"
            className="post__box--action btn-transparent"
            onClick={handleFull}
          >
            <i className="ri-file-list-2-line" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
