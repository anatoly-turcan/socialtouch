import React, { useState, useEffect } from 'react';
import Loader from '../common/loader';
import CommentBox from './commentBox';
import {
  getPostComments,
  createComment,
  deleteComment,
} from '../../services/apiService';

const PostComments = ({ link }) => {
  const [comments, setComments] = useState([]);
  const [loader, setLoader] = useState(true);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const [isAll, setIsAll] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const newComments = await getPostComments(link, page);

      if (newComments.length === 0) setIsAll(true);
      else setComments([...comments, ...newComments]);

      setLoader(false);
    };
    fetchComments();
  }, [page]);

  useEffect(() => {
    if (comments.length)
      if (comments.length % 10) setIsAll(true);
      else if (comments.length % 10 === 0) setIsAll(false);
  }, [comments]);

  const handleChange = ({ currentTarget: textarea }) => {
    setContent(textarea.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await createComment(link, content);

    if (success) {
      if (page === 1) {
        const newComments = [
          ...(await getPostComments(link, 1, 1)),
          ...comments,
        ];
        if (comments.length && comments.length % 10 === 0) newComments.pop();

        setComments(newComments);
      } else {
        setComments([]);
        setPage(1);
      }

      setContent('');
    }
  };

  const handleLoadMore = (event) => {
    event.preventDefault();
    setPage(page + 1);
  };

  const handleDelete = async (commentLink) => {
    const success = await deleteComment(link, commentLink);

    if (success) {
      const clearComments = comments.filter(
        (comment) => comment.link !== commentLink
      );

      setComments([
        ...clearComments,
        ...(await getPostComments(link, comments.length, 1)),
      ]);
    }
  };

  const renderComments = () =>
    comments.length
      ? comments.map((comment) => (
          <CommentBox
            handleDelete={handleDelete}
            user={comment.user}
            comment={comment}
            postLink={link}
            key={comment.link}
          />
        ))
      : 'No comments';

  const renderCreateComment = () => (
    <form className="create-comment-form" onSubmit={handleSubmit}>
      <textarea
        name="content"
        className="w-100 pb-comments-area"
        value={content}
        placeholder="Your comment"
        onChange={handleChange}
      />
      <button type="submit" className="btn btn-dark">
        <i className="ri-send-plane-fill"></i>
      </button>
    </form>
  );

  if (loader)
    return (
      <div className="post__box--comments">
        <Loader size={5} />
      </div>
    );

  return (
    <div className="post__box--comments">
      {renderCreateComment()}
      {renderComments()}
      {!isAll && (
        <button className="post__box--load-more" onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default PostComments;
