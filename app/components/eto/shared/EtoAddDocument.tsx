import * as React from "react";
import Dropzone from "react-dropzone";
import { compose } from "redux";

import { EEtoDocumentType } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import * as styles from "./EtoAddDocument.module.scss";

interface IDispatchProps {
  onDropFile: (file: File, documentType: EEtoDocumentType) => void;
}

interface IOwnProps {
  documentType: EEtoDocumentType;
  disabled?: boolean;
}
//todo dropzone should accept all files dropped, not only the first one, see #2243
export const ETOAddDocumentsComponent: React.FunctionComponent<IDispatchProps & IOwnProps> = ({
  onDropFile,
  children,
  documentType,
  disabled,
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0], documentType);
  return (
    <Dropzone
      data-test-id="eto-add-document-drop-zone"
      accept="application/pdf"
      onDrop={onDrop}
      activeClassName={styles.invisible}
      acceptClassName={styles.invisible}
      rejectClassName={styles.invisible}
      disabledClassName={styles.invisible}
      className={styles.invisible}
      disabled={disabled}
    >
      {children}
    </Dropzone>
  );
};

export const ETOAddDocuments = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<{}, IDispatchProps, IOwnProps>({
    dispatchToProps: dispatch => ({
      onDropFile: (file: File, documentType: EEtoDocumentType) =>
        dispatch(
          actions.etoDocuments.showIpfsModal(() =>
            dispatch(actions.etoDocuments.etoUploadDocument(file, documentType)),
          ),
        ),
    }),
  }),
)(ETOAddDocumentsComponent);
