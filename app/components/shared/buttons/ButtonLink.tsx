import { LocationDescriptor } from "history";
import * as React from "react";
import { matchPath } from "react-router";
import { compose, mapProps, setDisplayName } from "recompose";

import { routingActions } from "../../../modules/routing/actions";
import { appConnect } from "../../../store";
import { OmitKeys } from "../../../types";
import { isExternalUrl } from "../../../utils/StringUtils";
import { Button, IButtonProps } from "./Button";

type TButtonLinkToProps = {
  to: LocationDescriptor;
  target?: string;
  isActive?: boolean;
};

type TButtonLinkComponentProps = {
  component?: React.ComponentType<IButtonProps>;
};

type TButtonWithProps = {
  isActive: boolean;
};

type TButtonStateProps = {
  currentPath: string | null;
};

type TButtonDispatchProps = {
  navigate: () => void;
};

type TButtonWithoutOnClick = OmitKeys<IButtonProps, "onClick">;

type TProps = TButtonLinkComponentProps & TButtonDispatchProps & TButtonWithoutOnClick;

const ButtonLinkLayout: React.FunctionComponent<TProps> = ({
  navigate,
  children,
  isActive,
  component: Component = Button,
  ...rest
}) => (
  <Component {...rest} onClick={navigate} isActive={isActive}>
    {children}
  </Component>
);

const ButtonLink = compose<
  TProps,
  TButtonLinkToProps & TButtonLinkComponentProps & TButtonWithoutOnClick
>(
  setDisplayName("ButtonLink"),
  appConnect<TButtonStateProps, TButtonDispatchProps, TButtonLinkToProps>({
    stateToProps: state => ({
      currentPath: state.router.location && state.router.location.pathname,
    }),
    dispatchToProps: (dispatch, { target, to }) => ({
      navigate: () => {
        if (typeof to === "string" && (target === "_blank" || isExternalUrl(to))) {
          return dispatch(routingActions.openInNewWindow(to));
        }

        return dispatch(routingActions.goTo(to));
      },
    }),
  }),
  mapProps<TButtonWithProps, TButtonStateProps & TButtonLinkToProps>(
    ({ currentPath, to, isActive, ...rest }) => {
      const path = typeof to === "string" ? to : to.pathname!;

      return {
        isActive:
          // allow to overwrite active state with custom logic
          isActive === undefined
            ? !!currentPath &&
              !!matchPath(path, {
                path: currentPath,
                exact: true,
              })
            : isActive,
        ...rest,
      };
    },
  ),
)(ButtonLinkLayout);

export { ButtonLink, ButtonLinkLayout };
