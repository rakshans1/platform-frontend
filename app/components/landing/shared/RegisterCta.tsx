import * as React from "react";

import { ButtonLink, ButtonWidth } from "../../shared/buttons";

import * as logo from "../../../assets/img/logo_capitalized.svg";
import * as styles from "./RegisterCta.module.scss";

interface ISelfProps {
  text: string;
  ctaText: string;
  ctaLink: string;
}

export const RegisterCta: React.FunctionComponent<ISelfProps> = ({ text, ctaText, ctaLink }) => {
  return (
    <section className={styles.registerCta}>
      <img className={styles.image} src={logo} alt="Neufund logo" />
      <h2 className={styles.ctaText}>{text}</h2>
      <ButtonLink width={ButtonWidth.WIDE} theme="white" to={ctaLink}>
        {ctaText}
      </ButtonLink>
    </section>
  );
};
