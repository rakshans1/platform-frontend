import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectIsMessageSigning } from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { HeaderProgressStepper } from "../../../shared/HeaderProgressStepper";
import { RegisterWalletComponent } from "../../light/Register/RegisterLightWallet";
import { WalletMessageSigner } from "../../WalletMessageSigner";
import { recoverRoutes } from "../router/recoverRoutes";
import { WalletLightSeedRecoveryComponent } from "./SeedRecovery";

interface IRecoveryFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

interface IDispatchProps {
  submitForm: (values: IRecoveryFormValues, seed: string) => void;
}

interface IStateProps {
  isMessageSigning: boolean;
}

interface IMainRecoveryProps extends IDispatchProps {
  // For testing purposes
  seed?: string;
}

interface IMainRecoveryState {
  seed?: string;
}

class RecoveryProcessesComponent extends React.Component<IMainRecoveryProps, IMainRecoveryState> {
  constructor(props: IMainRecoveryProps) {
    super(props);
    this.state = { seed: props.seed };
  }
  setSeed = (words: string): void => {
    this.setState({ seed: words });
  };

  render(): React.ReactNode {
    const { submitForm } = this.props;
    return (
      <>
        {this.state.seed ? (
          <div>
            <HeaderProgressStepper
              headerText={<FormattedMessage id="wallet-selector.recover.seed.header" />}
              descText={<FormattedMessage id="wallet-selector.recover.seed.register-description" />}
              currentStep={7}
              steps={8}
            />
            <RegisterWalletComponent
              restore={true}
              submitForm={(values: IRecoveryFormValues) => {
                submitForm({ ...values }, this.state.seed!);
              }}
            />
          </div>
        ) : (
          <div>
            <WalletLightSeedRecoveryComponent
              startingStep={0}
              extraSteps={2}
              sendWords={this.setSeed}
            />
          </div>
        )}
        <Col md={12}>
          <Row className="mt-5 pt-5 justify-content-end align-items-center">
            <Link to={recoverRoutes.help}>
              <FormattedMessage id="wallet-selector.recover.help.contact-for-help" />{" "}
              <i className="fa fa-lg fa-angle-right ml-1" />
            </Link>
          </Row>
        </Col>
      </>
    );
  }
}

const RecoverWallet = compose<IMainRecoveryProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isMessageSigning: selectIsMessageSigning(s),
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IRecoveryFormValues, seed: string) => {
        dispatch(actions.walletSelector.lightWalletRecover(values.email, values.password, seed));
      },
    }),
  }),
  branch<IStateProps>(
    props => props.isMessageSigning,
    renderComponent(() => <WalletMessageSigner rootPath={"/"} />),
  ),
)(RecoveryProcessesComponent);

export { RecoverWallet, RecoveryProcessesComponent };
