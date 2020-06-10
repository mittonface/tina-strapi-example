import axios from "axios";

export const STRAPI_JWT = "tina_strapi_jwt";
export const STRAPI_URL = "http://localhost:1337";

export class TinaStrapiClient {
  async authenticate(username: string, password: string) {
    return axios.post(`${STRAPI_URL}/auth/local`, {
      identifier: username,
      password: password,
    });
  }
}
