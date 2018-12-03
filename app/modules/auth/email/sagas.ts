import { TGlobalDependencies } from "../../../di/setupBindings";
import { IVerifyEmailUser } from "../../../lib/api/users/interfaces";
import { EmailAlreadyExists } from "../../../lib/api/users/UsersApi";

export async function verifyUserEmailPromise(
  {
    apiUserService,
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  userCode: IVerifyEmailUser,
  urlEmail: string,
  verifiedEmail: string,
): Promise<void> {
  if (urlEmail === verifiedEmail) {
    notificationCenter.info(
      formatIntlMessage("modules.auth.sagas.verify-user-email-promise.email-already-verified"),
    );
    return;
  }
  if (!userCode) return;
  try {
    await apiUserService.verifyUserEmail(userCode);
    notificationCenter.info(
      formatIntlMessage("modules.auth.sagas.verify-user-email-promise.email-verified"),
    );
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(
        formatIntlMessage("modules.auth.sagas.sign-in-user.email-already-exists"),
      );
    else
      notificationCenter.error(
        formatIntlMessage("modules.auth.sagas.verify-user-email-promise.failed-email-verify"),
      );
  }
}
