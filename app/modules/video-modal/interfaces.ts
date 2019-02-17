export interface IStateVideoModal {
  isOpen: boolean;
  videoModalObj?: IStateVideoModalData;
}

export interface IBlVideoModal {
  isOpen: boolean;
  videoModalObj?: IBlVideoModalData;
}

export interface IStateVideoModalData {
  youTubeUrl: string;
}

export interface IBlVideoModalData {
  youTubeUrl: string;
}
