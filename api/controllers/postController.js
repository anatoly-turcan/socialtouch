const paginate = require('../utils/paginate');
const apiFilter = require('../utils/apiFilter');

exports.getAllPosts = async ({ Post, query }, res) => {
  const posts = await Post.findAll(apiFilter(query, 'post_id'));

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
};

exports.getPost = async ({ Post, params }, res) => {
  const post = await Post.findOne({ where: { link: params.link } });

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
};

exports.createPost = async ({ Post, body }, res) => {
  const newPost = await Post.create({
    content: body.content,
    link: Post.generateLink(),
  });

  res.status(200).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
};

exports.updatePost = async ({ Post, params, body }, res) => {
  await Post.update(
    { content: body.content },
    {
      where: {
        link: params.link,
      },
    }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.deletePost = async ({ Post, params }, res) => {
  await Post.destroy({
    where: {
      link: params.link,
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
