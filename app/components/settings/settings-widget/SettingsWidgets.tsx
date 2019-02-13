import * as React from "react";
import { Col } from "reactstrap";

import { ERequestStatus } from "../../../lib/api/KycApi.interfaces";
import { BackupSeedWidget } from "../backup-seed/BackupSeedWidget";
import { KycStatusWidget } from "../kyc-states/KycStatusWidget";
import { VerifyEmailWidget } from "../verify-email/VerifyEmailWidget";

interface IProps {
  isDynamic: boolean;
  isLightWallet?: boolean;
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  requestStatus?: ERequestStatus;
}

export const SettingsWidgets: React.FunctionComponent<IProps> = ({
  isLightWallet,
  backupCodesVerified,
  verifiedEmail,
  isDynamic,
  requestStatus,
}) => {
  let settingsStepCounter = 0;
  return (
    <>
      {(!isDynamic || !verifiedEmail) && (
        <Col lg={4} xs={12}>
          <VerifyEmailWidget step={++settingsStepCounter} />
        </Col>
      )}
      {(!isDynamic || !backupCodesVerified) &&
        isLightWallet && (
          <Col lg={4} xs={12}>
            <BackupSeedWidget step={++settingsStepCounter} />
          </Col>
        )}
      {(!isDynamic || requestStatus !== ERequestStatus.ACCEPTED) && (
        <Col lg={4} xs={12}>
          <KycStatusWidget step={++settingsStepCounter} />
        </Col>
      )}
    </>
  );
};
