const next = require('next');
const axios = require('axios');
const express = require('express');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const api = process.env.API || 'http://localhost:1337';
const app = next({ dev });
const handle = app.getRequestHandler();

const COOKIE_SECRET = "showmethewaytothenextwhiskeybar";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev,
  signed: true
};

/**
 * Authenticate with Strapi BE
 *
 * @param email
 * @param password
 * @returns {Promise<any>}
 */
const authenticate = async (email, password) => {
  try {
    const { data } = await axios.post(`${api}/auth/local`, {
      identifier: email,
      password
    });

    return data;

  } catch (err) {
    // Always returns a data object
    const { data = {} } = err.response;
    return data;
  }
};

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(cookieParser(COOKIE_SECRET));

  /**
   * POST - Login Route
   */
  server.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const data = await authenticate(email, password);
    if (!data || !data.jwt) {
      const { statusCode, message } = data;
      return res.status(statusCode).send(message);
    }
    let clientData = Object.assign({}, data.user);
    clientData.jwt = data.jwt;
    //console.log(clientData);
    res.cookie('token', clientData, COOKIE_OPTIONS);
    res.json(clientData);
  });

  /**
   * POST - Logout Route
   */
  server.post('/api/logout', (req, res) => {
    res.clearCookie('token', COOKIE_OPTIONS);
    res.sendStatus(204);
  });

  /**
   * GET - User Profile
   */
  server.get('/api/profile', async (req, res) => {
    const { signedCookies = {} } = req;
    const { token } = signedCookies;

    if (token) {
      try {
        const config = {
          headers: {'Authorization': "bearer " + token.jwt}
        };

        const { data } = await axios.get(`${api}/users/me`, config);
        return res.json({ user: data })
      } catch (err) {
        const { data = {} } = err.response;

        res.status(data.statusCode);
        return res.json({ error: data })
      }
    }
    res.sendStatus(404);
  });

  /**
   * Catch-all lets Next.js take care of it
   */
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /**
   * Fire it up!
   */
  server.listen(port, err => {
    if (err) throw err;
    console.log(`Listening on PORT ${port}`);
  })

});