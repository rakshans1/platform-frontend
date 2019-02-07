import { TMessage } from "../../components/translatedMessages/utils";
import { createActionFactory } from "../actionsUtils";
import {ImmutableFileIdState} from './interfaces'

export const immutableStorageActions = {
  downloadImmutableFile: createActionFactory(
    "IMMUTABLE_STORAGE_DOWNLOAD_FILE",
    (immutableFileId: ImmutableFileIdState, fileName: TMessage | string) => ({
      immutableFileId,
      fileName,
    }),
  ),
  downloadDocumentStarted: createActionFactory(
    "IMMUTABLE_STORAGE_DOWNLOAD_DOCUMENT_STARTED",
    (ipfsHash: string) => ({ ipfsHash }),
  ),
  downloadImmutableFileDone: createActionFactory(
    "IMMUTABLE_STORAGE_DOWNLOAD_FILE_DONE",
    (ipfsHash: string) => ({ ipfsHash }),
  ),
};
