export type AssetManifests = Record<
  string, // id
  {
    accessKey: string;
    basePath: string;
    assetsUrl: {
      from: string;
      to: string;
    };
  }
>;
