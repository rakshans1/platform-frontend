import { TMessage } from "../../components/translatedMessages/utils";
import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { createActionFactory } from "../actionsUtils";

export const immutableStorageActions = {
  downloadImmutableFile: createActionFactory(
    "IMMUTABLE_STORAGE_DOWNLOAD_FILE",
    (immutableFileId: ImmutableFileId, fileName: TMessage | string) => ({
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
