import {IEtoSocialProfile} from "../../components/shared/SocialProfilesList";

export interface IPersonProfileModalState {
  isOpen: boolean;
  personProfileModalObj?: IPersonProfileModalObjectState;
}

export interface IPersonProfileModalObjectState {
  image: string;
  name: string;
  role: string;
  description: string | React.ReactNode; //fixme no reactNodes in state!
  socialChannels: IEtoSocialProfile[]; //fixme this should not be in components
  website?: string;
}
