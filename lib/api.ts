import axios from "axios";
import { STRAPI_URL } from "../components/tina-strapi/tina-strapi-client";

export const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

export async function fetchGraphql(query, variables = {}) {
  const response = await axios.post(
    GRAPHQL_ENDPOINT,
    { query: query, variables: variables },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
}
