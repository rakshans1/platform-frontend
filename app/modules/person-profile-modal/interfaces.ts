import {IEtoSocialProfile} from "../../components/shared/SocialProfilesList";

export interface IStatePersonProfileModal {
  isOpen: boolean;
  personProfileModalObj?: IStatePersonProfileModalObject;
}

export interface IStatePersonProfileModalObject {
  image: string;
  name: string;
  role: string;
  description: string | React.ReactNode; //fixme no reactNodes in state!
  socialChannels: IEtoSocialProfile[]; //fixme this should not be in components
  website?: string;
}
