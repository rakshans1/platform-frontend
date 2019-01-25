import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../types";
import { Button, ButtonTextPosition, EButtonLayout } from "./buttons";
import { Document } from "./Document";

import * as styles from "./DocumentLink.module.scss";

export interface IDocumentLinkProps {
  url: string;
  name: TTranslatedString;
  altIcon?: React.ReactNode;
}

const DocumentLink: React.FunctionComponent<IDocumentLinkProps> = ({ url, name, altIcon }) => {
  const contents = (
    <>
      {altIcon || <Document extension={url} />}
      {name}
    </>
  );

  if (url === "") {
    return <span className={styles.documentLink}>{contents}</span>;
  } else {
    return (
      <a href={url} className={styles.documentLink} target="_blank">
        {contents}
      </a>
    );
  }
};

export interface IDocumentTemplateButtonProps {
  title: string | React.ReactNode;
  altIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const DocumentTemplateButton: React.FunctionComponent<IDocumentTemplateButtonProps> = ({
  onClick,
  title,
  altIcon,
}) => {
  return (
    <Button
      layout={EButtonLayout.INLINE}
      onClick={onClick}
      innerClassName={styles.documentButton}
      textPosition={ButtonTextPosition.LEFT}
    >
      {altIcon || <Document extension="pdf" />}
      {title}
    </Button>
  );
};
export interface IDocumentTemplateButtonProps {
  title: string | React.ReactNode;
  altIcon?: React.ReactNode;
  className?: string;
}

const DocumentTemplateLabel: React.FunctionComponent<IDocumentTemplateButtonProps> = ({
  title,
  altIcon,
  className,
}) => {
  return (
    <div className={cn(styles.documentButton, className)}>
      {altIcon || <Document extension="pdf" />}
      {title}
    </div>
  );
};

export { DocumentLink, DocumentTemplateButton, DocumentTemplateLabel };
