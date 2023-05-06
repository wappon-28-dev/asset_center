type TokenRequest = {
  scope: "https%3A%2F%2Fgraph.microsoft.com%2F.default";
  client_secret: string;
  grant_type: "client_credentials";
};

type TokenResponse = {
  token_type: "Bearer";
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};

export type { TokenRequest, TokenResponse };
