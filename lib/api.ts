import {
  STRAPI_JWT,
  STRAPI_URL,
} from "../components/tina-strapi/tina-strapi-client";

import Cookies from "js-cookie";
import axios from "axios";

export const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

export async function fetchGraphql(query, variables = {}) {
  const jwt = Cookies.get(STRAPI_JWT);
  const headers = {
    "Content-Type": "application/json",
  };

  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;

  const response = await axios.post(
    GRAPHQL_ENDPOINT,
    { query: query, variables: variables },
    { headers: { ...headers } }
  );

  return response.data;
}
