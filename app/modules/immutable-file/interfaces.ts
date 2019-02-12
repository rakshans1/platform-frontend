export interface IImmutableStorageState {
  pendingDownloads: { [ipfsHash: string]: boolean };
}

export interface IImmutableFileId {
  ipfsHash: string;
  mimeType: string;
  placeholders?: { [key: string]: string };
  asPdf: boolean;
}
