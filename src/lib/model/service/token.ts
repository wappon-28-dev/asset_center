import { env } from "$env/dynamic/private";
import axios, { type AxiosResponse } from "axios";
import { url } from "../constants";
import type { TokenRequest, TokenResponse } from "../types/res_req";

async function postTokenRequest(): Promise<TokenResponse> {
  const body: TokenRequest = {
    scope: "https%3A%2F%2Fgraph.microsoft.com%2F.default",
    client_secret: env.CLIENT_SECRET,
    grant_type: "client_credentials",
  };

  const { data, status }: AxiosResponse<TokenResponse> =
    await axios.post<TokenResponse>(url.tokenRequestEndpoint(), body);

  if (status !== 200) {
    throw new Error("Token Request Error");
  }

  return data;
}

async function saveAccessToken(data: TokenResponse): Promise<void> {}

export { postTokenRequest, saveAccessToken };
