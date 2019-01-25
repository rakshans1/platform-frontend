import * as cn from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { IKycFileInfo, TKycRequestType } from "../../lib/api/KycApi.interfaces";

import { InlineIcon } from "./InlineIcon";
import { ResponsiveImage } from "./ResponsiveImage";
import { UploadedFiles } from "./UploadedFiles";

import { TAcceptedFileType } from "../../types";

import * as bankStatementTemplate from "../../assets/img/bank-statement-template.svg";
import * as documentBothSidesImage from "../../assets/img/document-both-side.jpg";
import * as documentBothSidesImage2x from "../../assets/img/document-both-side@2x.jpg";
import * as documentBothSidesImage3x from "../../assets/img/document-both-side@3x.jpg";
import * as addFileIcon from "../../assets/img/inline_icons/add_file.svg";
import * as styles from "./MultiFileUpload.module.scss";

interface IProps {
  uploadType: TKycRequestType | TKycRequestType[];
  acceptedFiles: TAcceptedFileType;
  fileUploading: boolean;
  onDropFile: (file: File) => void;
  layout?: "horizontal" | "vertical";
  files?: ReadonlyArray<IKycFileInfo>;
  "data-test-id"?: string;
}

const MultiFileUploadComponent: React.FunctionComponent<IProps> = ({
  acceptedFiles,
  fileUploading,
  files,
  layout,
  onDropFile,
  "data-test-id": dataTestId,
  ...props
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0]);

  const dropzoneInner = fileUploading ? (
    <FormattedMessage id="shared-component.multi-file-upload.uploading" />
  ) : (
    <FormattedHTMLMessage tagName="span" id="shared-component.multi-file-upload.upload-cta" />
  );

  const dropzoneWithFilesInner = (
    <FormattedMessage id="shared-component.multi-file-upload.add-more" />
  );

  return (
    <div className={cn(styles.multiFileUpload, layout)} data-test-id={dataTestId}>
      <Dropzone
        data-test-id="multi-file-upload-dropzone"
        accept={acceptedFiles}
        onDrop={onDrop}
        disabled={fileUploading}
        className={styles.dropzone}
        {...props}
      >
        <br />
        <InlineIcon svgIcon={addFileIcon} />
        {files && files.length ? dropzoneWithFilesInner : dropzoneInner}
      </Dropzone>
      <br />
      {files && files.length > 0 && <UploadedFiles files={files} />}

      <div className={styles.requirements}>
        <p className={styles.requirementsTitle}>
          <FormattedHTMLMessage
            tagName="span"
            id="shared-component.multi-file-upload.requirements.file-requirements"
          />
        </p>
      </div>
    </div>
  );
};

MultiFileUploadComponent.defaultProps = {
  layout: "horizontal",
};

export const MultiFileUpload: React.FunctionComponent<IProps> = ({
  fileUploading,
  files,
  onDropFile,
  uploadType,
  layout,
  "data-test-id": dataTestId,
}) => {
  const isIndividual = uploadType === "individual";

  return (
    <div className={styles.upload}>
      {!isIndividual && (
        <div className={styles.uploadInformationsWrapper}>
          <div className={styles.title}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.business.documents"
            />
          </div>
          <h4 className={cn(styles.hint, "mb-3")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.business.documents-note" />
          </h4>
        </div>
      )}
      {isIndividual && (
        <div className={styles.uploadInformationsWrapper}>
          <div className={styles.title}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.individual.proof-of-identity"
            />
          </div>
          <h4 className={cn(styles.hint, "mb-3")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.proof-of-identity-note" />
          </h4>
          <ResponsiveImage
            srcSet={{
              "1x": documentBothSidesImage,
              "2x": documentBothSidesImage2x,
              "3x": documentBothSidesImage3x,
            }}
            alt="ID"
            width={344}
            height={111}
          />
          <div className={cn(styles.title, "mt-4")}>
            <FormattedHTMLMessage
              tagName="span"
              id="shared-component.multi-file-upload.requirements.individual.proof-of-address"
            />
          </div>
          <h4 className={cn(styles.hint, "mb-3")}>
            <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.proof-of-address-note" />
          </h4>
          <div className={styles.imagesWrapper}>
            <div className={styles.bankStatementWrapper}>
              <img src={bankStatementTemplate} alt="bank statement" />
            </div>
            <div className={styles.idWrapper} />
          </div>
        </div>
      )}
      <MultiFileUploadComponent
        acceptedFiles="image/*,application/pdf"
        onDropFile={onDropFile}
        files={files}
        fileUploading={fileUploading}
        uploadType={uploadType}
        layout={layout}
        data-test-id={dataTestId}
      />
    </div>
  );
};
