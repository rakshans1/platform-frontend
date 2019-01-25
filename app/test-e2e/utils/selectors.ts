export function tid(id: string, rest?: string): string {
  return `[data-test-id="${id}"]` + (rest ? ` ${rest}` : "");
}

/**
 * Returns TID for notification
 * We can't use `tid` method because notification TID is provided as a class
 * as `react-toastify` doesn't allow custom attributes
 * @param notificationTid
 */
export const notificationTid = (notificationTid: string) => `.${notificationTid}`;

export function formFieldErrorMessage(key: string): string {
  return tid(`form.${key}.error-message`);
}

export function formField(name: string): string {
  return `[name="${name}"], ${tid(name)}, ${tid(`form.name.${name}`)}`;
}
