require('dotenv').config({ path: './.env' });
const { expect } = require('chai');
const request = require('supertest');
const { createConnection } = require('typeorm');
const User = require('../entities/userSchema');
const UserSettings = require('../entities/userSettingsSchema');
const Friends = require('../entities/friendsSchema');
const UserModel = require('../models/userModel');
const ormconfig = require('../ormconfig');
const app = require('../app');

const api = '/api/v1';

const connectionOptions = {
  ...ormconfig,
  host: 'socialtouch-db.cfoocivessmh.eu-central-1.rds.amazonaws.com',
  username: 'admin',
  password: '0K0YBvw0Sx41a3j',
  database: 'socialtouch_test',
};

describe('user', function () {
  let connection;
  let user;
  let friend;
  let cookie;

  before('open db connection, init database', async function () {
    connection = await createConnection(connectionOptions);
    user = await new UserModel(
      'test',
      't@es.t',
      'test1234',
      'test1234'
    ).prepare();

    friend = await new UserModel(
      'friend',
      'fr@ie.nd',
      'friend123',
      'friend123'
    ).prepare();

    await connection.getRepository(User).save(user);
    await connection.getRepository(UserSettings).save({ userId: user.id });
    await connection.getRepository(User).save(friend);
  });

  after('clear database, close db connection', async function () {
    await connection
      .getRepository(User)
      .createQueryBuilder()
      .delete()
      .execute();

    await connection
      .getRepository(UserSettings)
      .createQueryBuilder()
      .delete()
      .execute();

    await connection
      .getRepository(Friends)
      .createQueryBuilder()
      .delete()
      .execute();

    await connection.close();
  });

  describe('/auth', function () {
    describe('POST /signup', function () {
      it('correct data: should return 201, user, cookie', async function () {
        const res = await request(app).post(`${api}/auth/signup`).send({
          username: 'signup',
          email: 'signup@te.st',
          password: '12345678',
          passwordConfirm: '12345678',
        });

        expect(res.status).to.be.equal(201);
        expect(res.body.data.user).to.be.an('object');
        expect(res.headers['set-cookie']).to.be.an('array');
      });

      it('user exists: should return 400, status fail, no cookie', async function () {
        const res = await request(app).post(`${api}/auth/signup`).send({
          username: user.username,
          email: 'signup@te.st',
          password: '12345678',
          passwordConfirm: '12345678',
        });

        expect(res.status).to.be.equal(400);
        expect(res.body.status).to.be.equal('fail');
        expect(res.headers['set-cookie']).to.be.undefined;
      });

      it('validation error: should return 400, status fail, no cookie', async function () {
        const res = await request(app).post(`${api}/auth/signup`).send({
          username: 'signup',
          email: 'wrong',
          password: '12345678',
          passwordConfirm: '12345678',
        });

        expect(res.status).to.be.equal(400);
        expect(res.body.status).to.be.equal('fail');
        expect(res.headers['set-cookie']).to.be.undefined;
      });
    });

    describe('POST /signin', function () {
      it('correct data: should return 200, user, cookie', async function () {
        const res = await request(app).post(`${api}/auth/signin`).send({
          email: user.email,
          password: user.password,
        });

        expect(res.status).to.equal(200);
        expect(res.headers['set-cookie']).to.be.an('array');
        expect(res.body.data.user).to.be.an('object');
        cookie = res.headers['set-cookie'];
      });

      it('wrong data: should return 401, status fail, no cookie', async function () {
        const res = await request(app).post(`${api}/auth/signin`).send({
          email: user.email,
          password: 'wrong123',
        });

        expect(res.status).to.be.equal(401);
        expect(res.body.status).to.be.equal('fail');
        expect(res.headers['set-cookie']).to.be.undefined;
      });

      it('validation error: should return 400, status fail, no cookie', async function () {
        const res = await request(app).post(`${api}/auth/signin`).send({
          email: user.email,
          password: '1',
        });

        expect(res.status).to.be.equal(400);
        expect(res.body.status).to.be.equal('fail');
        expect(res.headers['set-cookie']).to.be.undefined;
      });
    });
  });

  describe('/users', function () {
    describe('GET /', function () {
      it('should return 200, an array of users', async function () {
        const res = await request(app)
          .get(`${api}/users`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.users).to.be.an('array');
      });
    });

    describe('GET /:link', function () {
      it('correct link: should return 200, a user', async function () {
        const res = await request(app)
          .get(`${api}/users/${user.link}`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.user).to.be.an('object');
      });

      it('no user with the link: should return 404', async function () {
        const res = await request(app)
          .get(`${api}/users/wrong`)
          .set('Cookie', [cookie]);

        expect(res.status).to.be.equal(404);
      });
    });

    describe('GET /:link/posts', function () {
      it('should return 200, an array of posts', async function () {
        const res = await request(app)
          .get(`${api}/users/${user.link}/posts`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.posts).to.be.an('array');
      });
    });

    describe('GET /:link/groups', function () {
      it('should return 200, an array of groups', async function () {
        const res = await request(app)
          .get(`${api}/users/${user.link}/groups`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.groups).to.be.an('array');
      });
    });

    describe('GET /:link/friends', function () {
      it('should return 200, an array of friends', async function () {
        const res = await request(app)
          .get(`${api}/users/${user.link}/friends`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.friends).to.be.an('array');
      });
    });

    describe('GET /:link/settings', function () {
      it('should return 200, settings', async function () {
        const res = await request(app)
          .get(`${api}/users/${user.link}/settings`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.settings).to.be.an('object');
      });
    });

    describe('GET /:link/friendsCount', function () {
      it('should return 200, friends count', async function () {
        const res = await request(app)
          .get(`${api}/users/${user.link}/friendsCount`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.count).to.be.a('number');
      });
    });

    describe('GET /:link/groupsCount', function () {
      it('should return 200, groups count', async function () {
        const res = await request(app)
          .get(`${api}/users/${user.link}/groupsCount`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.count).to.be.a('number');
      });
    });

    describe('GET /search', function () {
      it('with query: should return 200, an array of users', async function () {
        const res = await request(app)
          .get(`${api}/users/search`)
          .query({ query: user.username.charAt(0) })
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.users).to.be.an('array');
      });

      it('without query: should return 400, status fail', async function () {
        const res = await request(app)
          .get(`${api}/users/search`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal('fail');
      });
    });

    describe('POST /:link/friends (Add a friend)', function () {
      it('correct request: should return 204', async function () {
        const res = await request(app)
          .post(`${api}/users/${friend.link}/friends`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(204);
      });

      it('repeat request: should return 400, status fail', async function () {
        const res = await request(app)
          .post(`${api}/users/${friend.link}/friends`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal('fail');
      });

      it('attempt to add yourself: should return 400, status fail', async function () {
        const res = await request(app)
          .post(`${api}/users/${user.link}/friends`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal('fail');
      });

      it('attempted confirmation by the sender: should return 404, status fail', async function () {
        const res = await request(app)
          .post(`${api}/users/${user.link}/confirmFriendship`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(404);
        expect(res.body.status).to.equal('fail');
      });
    });

    describe('DELETE /:link/friends (Unfriend)', function () {
      it('correct request: should return 204', async function () {
        await request(app)
          .post(`${api}/users/${friend.link}/friends`)
          .set('Cookie', [cookie]);

        const res = await request(app)
          .delete(`${api}/users/${friend.link}/friends`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(204);
      });

      it('repeat request: should return 400, status fail', async function () {
        const res = await request(app)
          .delete(`${api}/users/${friend.link}/friends`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal('fail');
      });

      it('attempt to unfriend yourself: should return 400, status fail', async function () {
        const res = await request(app)
          .delete(`${api}/users/${user.link}/friends`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal('fail');
      });
    });
  });

  describe('/users/me', function () {
    describe('GET /', function () {
      it('with cookie: should return 200, user', async function () {
        const res = await request(app)
          .get(`${api}/users/me`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.user).to.be.an('object');
      });

      it('no cookie: should return 401, status fail', async function () {
        const res = await request(app).get(`${api}/users/me`);

        expect(res.status).to.be.equal(401);
        expect(res.headers['set-cookie']).to.be.undefined;
      });
    });

    describe('PATCH /', function () {
      it('correct data: should return 204', async function () {
        const username = 'new_username';
        const res = await request(app)
          .patch(`${api}/users/me`)
          .send({ username })
          .set('Cookie', [cookie]);

        expect(res.status).to.be.equal(204);
        user.username = username;
      });

      it('validation error: should return 400, status fail', async function () {
        const res = await request(app)
          .patch(`${api}/users/me`)
          .send({ username: '1' })
          .set('Cookie', [cookie]);

        expect(res.status).to.be.equal(400);
        expect(res.body.status).to.be.equal('fail');
      });
    });

    describe('GET /friendRequests', function () {
      it('should return 200, an array of friend requests', async function () {
        const res = await request(app)
          .get(`${api}/users/me/friendRequests`)
          .set('Cookie', [cookie]);

        expect(res.status).to.equal(200);
        expect(res.body.data.requests).to.be.an('array');
      });
    });

    describe('PATCH /settings', function () {
      it('correct data: should return 204', async function () {
        const res = await request(app)
          .patch(`${api}/users/me/settings`)
          .send({ gender: 'female' })
          .set('Cookie', [cookie]);

        expect(res.status).to.be.equal(204);
      });

      it('validation error: should return 400, status fail', async function () {
        const res = await request(app)
          .patch(`${api}/users/me/settings`)
          .send({ gender: 'wrong' })
          .set('Cookie', [cookie]);

        expect(res.status).to.be.equal(400);
        expect(res.body.status).to.be.equal('fail');
      });
    });

    describe('DELETE /', function () {
      it('should return 204', async function () {
        const res = await request(app)
          .delete(`${api}/users/me`)
          .set('Cookie', [cookie]);

        expect(res.status).to.be.equal(204);
      });
    });
  });
});
