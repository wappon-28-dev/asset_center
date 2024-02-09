export type AssetManifests = Record<
  string, // id
  {
    accessKey: string;
    microcms: {
      apiKey: string;
    };
  }
>;
