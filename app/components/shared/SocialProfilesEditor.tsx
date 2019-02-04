import * as cn from "classnames";
import { connect, FieldArray, getIn } from "formik";
import * as React from "react";

import { TSocialChannelsType } from "../../lib/api/eto/EtoApi.interfaces";
import { CommonHtmlProps, TFormikConnect } from "../../types";
import { FormField } from "./forms";
import { InlineIcon } from "./InlineIcon";

import * as iconChat from "../../assets/img/inline_icons/icon-menu-help.svg";
import * as facebookIcon from "../../assets/img/inline_icons/social_facebook.svg";
import * as githubIcon from "../../assets/img/inline_icons/social_github.svg";
import * as googleIcon from "../../assets/img/inline_icons/social_google_plus.svg";
import * as instagramIcon from "../../assets/img/inline_icons/social_instagram.svg";
import * as linkedinIcon from "../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import * as slackIcon from "../../assets/img/inline_icons/social_slack.svg";
import * as telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";
import * as socialTwitter from "../../assets/img/inline_icons/social_twitter.svg";
import * as xingIcon from "../../assets/img/inline_icons/social_xing.svg";
import * as youtubeIcon from "../../assets/img/inline_icons/social_youtube.svg";
import * as styles from "./SocialProfilesEditor.module.scss";

export const SOCIAL_PROFILES_ICONS = [
  {
    name: "twitter",
    placeholder: "Twitter",
    svgIcon: socialTwitter,
    preSelected: true,
  },
  {
    name: "facebook",
    placeholder: "Facebook",
    svgIcon: facebookIcon,
  },
  {
    name: "linkedin",
    placeholder: "LinkedIn",
    svgIcon: linkedinIcon,
  },
  {
    name: "slack",
    placeholder: "Slack",
    svgIcon: slackIcon,
  },
  {
    name: "medium",
    placeholder: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "reddit",
    placeholder: "Reddit",
    svgIcon: redditIcon,
  },
  {
    name: "telegram",
    placeholder: "Telegram",
    svgIcon: telegramIcon,
  },
  {
    name: "github",
    placeholder: "Github",
    svgIcon: githubIcon,
  },
  {
    name: "instagram",
    placeholder: "Instagram",
    svgIcon: instagramIcon,
  },
  {
    name: "gplus",
    placeholder: "Google plus",
    svgIcon: googleIcon,
  },
  {
    name: "youtube",
    placeholder: "YoutTube",
    svgIcon: youtubeIcon,
  },
  {
    name: "xing",
    placeholder: "Xing",
    svgIcon: xingIcon,
  },
  {
    name: "bitcointalk",
    placeholder: "Bitcointalk",
    svgIcon: iconChat,
  },
];

export const SOCIAL_PROFILES_PERSON = [
  {
    name: "medium",
    placeholder: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "twitter",
    placeholder: "Twitter",
    svgIcon: socialTwitter,
  },
  {
    name: "linkedin",
    placeholder: "LinkedIn",
    svgIcon: linkedinIcon,
  },
];

const SocialMediaTags: React.FunctionComponent<{
  profiles: ISocialProfile[];
  className?: string;
  onClick: (index: number) => void;
  selectedFields: boolean[];
}> = props => {
  const { profiles, className, onClick, selectedFields } = props;
  return (
    <div className={cn(styles.socialProfilesEditor, className)}>
      <div className={styles.tabs}>
        {profiles.map(({ name, svgIcon }, index) => (
          <button
            data-test-id={`social-profiles.profile-button.${name}`}
            onClick={() => onClick(index)}
            className={cn(Boolean(selectedFields[index]) && "is-selected", styles.tab)}
            key={name}
            type="button"
          >
            <InlineIcon svgIcon={svgIcon} />
          </button>
        ))}
      </div>
    </div>
  );
};

interface ISingleMediaLinkFieldInternalProps {
  name: string;
  profile: ISocialProfile;
}

const SingleMediaLinkField: React.FunctionComponent<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const { profile, name } = props;

  return (
    <FormField
      name={`${name}.url`}
      placeholder={profile.placeholder || profile.name}
      data-test-id={`social-profiles.profile-input.${profile.name}`}
    />
  );
};

export interface ISocialProfile {
  name: string;
  svgIcon: string;
  placeholder?: string;
  url?: string;
  preSelected?: boolean;
}

interface IProps {
  className?: string;
  profiles: ISocialProfile[];
  name: string;
}

interface IState {
  selectedFields: boolean[];
  filteredFields: boolean[];
}

class SocialProfilesEditorLayout extends React.Component<IProps & TFormikConnect, IState> {
  state: IState = { selectedFields: [], filteredFields: [] };

  componentDidMount(): void {
    const { name, profiles, formik } = this.props;
    const { values, setFieldValue } = formik;

    const socialMediaValues: TSocialChannelsType = getIn(values, name) || [];
    const selectedFields: boolean[] = [];

    profiles.forEach((profile, index) => {
      const previousLink = socialMediaValues.find(v => v.type === profile.name);
      const value: string = previousLink ? previousLink.url || "" : "";
      setFieldValue(`${name}.${index}`, { type: profile.name, url: value });
      selectedFields[index] = profile.preSelected ? true : !!value;
    });

    this.setState({ selectedFields });
  }

  toggleProfileVisibility = (index: number): void => {
    const { selectedFields } = this.state;

    selectedFields[index] = !this.state.selectedFields[index];

    this.setState({ selectedFields });
  };

  render(): React.ReactNode {
    const { profiles, className, name } = this.props;
    const { selectedFields } = this.state;

    return (
      <section data-test-id={name} className={className}>
        <SocialMediaTags
          profiles={profiles}
          onClick={this.toggleProfileVisibility}
          selectedFields={selectedFields}
        />
        <FieldArray
          name={name}
          render={_ =>
            selectedFields.map(
              (singleField: boolean, index: number) =>
                singleField && (
                  <SingleMediaLinkField
                    key={index}
                    name={`${name}.${index}`}
                    profile={profiles[index]}
                  />
                ),
            )
          }
        />
      </section>
    );
  }
}

export const SocialProfilesEditor = connect<IProps, any>(SocialProfilesEditorLayout);
