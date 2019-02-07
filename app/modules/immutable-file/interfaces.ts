export interface IImmutableStorageState {
  pendingDownloads: { [ipfsHash: string]: boolean };
}

export interface ImmutableFileIdState {
  ipfsHash: string;
  mimeType: string;
  placeholders?: { [key: string]: string };
  asPdf: boolean;
}
