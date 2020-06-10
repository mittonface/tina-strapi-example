import {
  STRAPI_JWT,
  STRAPI_URL,
} from "../../components/tina-strapi/tina-strapi-client";

import axios from "axios";
import querystring from "querystring";

export default (req, res) => {
  // we need to take the query params that we're getting from github and post them
  // back to strapi in order to get the JWT
  const queryString = querystring.stringify(req.query);

  axios
    .get(`${STRAPI_URL}/auth/github/callback?${queryString}`)
    .then((response) => {
      res.setHeader("Set-Cookie", `${STRAPI_JWT}=${response.data.jwt};Path=/`);
      res.status(200).end();
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
