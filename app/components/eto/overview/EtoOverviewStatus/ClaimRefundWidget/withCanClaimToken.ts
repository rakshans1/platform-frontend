import { compose, withProps } from "recompose";

import { EUserType } from "../../../../../lib/api/users/interfaces";
import { actions } from "../../../../../modules/actions";
import { selectUserType } from "../../../../../modules/auth/selectors";
import {
  selectHasInvestorTicket,
  selectInvestorTicket,
} from "../../../../../modules/investor-portfolio/selectors";
import { IInvestorTicket } from "../../../../../modules/investor-portfolio/types";
import { EETOStateOnChain } from "../../../../../modules/public-etos/types";
import { appConnect } from "../../../../../store";
import { Omit } from "../../../../../types";

interface IExternalProps {
  etoId: string;
  timedState: EETOStateOnChain;
}

interface IStateProps {
  doesInvestorInvest: boolean;
  userType: EUserType | undefined;
  investorTicket?: IInvestorTicket;
}

interface IDispatchProps {
  onClaim: (etoId: string) => void;
}
interface IWithProps {
  canClaimToken: boolean;
  onClaim: (etoId: string) => void;
}

export const withCanClaimToken = <T extends IWithProps>(wrapper: React.ComponentType<T>) =>
  compose<T, IExternalProps & Omit<T, IWithProps>>(
    appConnect<IStateProps, IDispatchProps, IExternalProps>({
      stateToProps: (state, props) => ({
        doesInvestorInvest: selectHasInvestorTicket(state, props.etoId),
        investorTicket: selectInvestorTicket(state, props.etoId),
        userType: selectUserType(state),
      }),
      dispatchToProps: dispatch => ({
        onClaim: (etoId: string) => dispatch(actions.txTransactions.startUserClaim(etoId)),
      }),
    }),
    withProps<IWithProps, IExternalProps & IStateProps & IDispatchProps>(props => ({
      canClaimToken:
        [EETOStateOnChain.Claim, EETOStateOnChain.Refund, EETOStateOnChain.Payout].includes(
          props.timedState,
        ) &&
        props.userType === EUserType.INVESTOR &&
        props.doesInvestorInvest &&
        // Checks if user already claimed
        !!(props.investorTicket && !props.investorTicket.claimedOrRefunded),
      onClaim: props.onClaim,
    })),
  )(wrapper);
