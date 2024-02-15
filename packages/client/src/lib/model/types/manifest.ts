export type AssetManifests = Record<
  string, // id
  {
    accessKey: string;
    assetsUrl: {
      from: string;
      to: string;
    };
  }
>;
