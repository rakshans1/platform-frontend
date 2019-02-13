import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../types";

import * as styles from "./Counter.module.scss";

interface IProps {
  endDate: Date;
  onFinish?: () => void;
  ["data-test-id"]?: string;
}

interface IPlateProps {
  value: number;
  label: React.ReactNode | string;
}

interface IState {
  timeLeft: number;
}

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const Plate: React.FunctionComponent<IPlateProps> = ({ value, label }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.plate}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export class Counter extends React.Component<IProps & CommonHtmlProps, IState> {
  getTimeLeft = () => {
    return this.props.endDate.getTime() - Date.now();
  };

  state = {
    timeLeft: this.getTimeLeft(),
  };

  timer: any = null;

  componentDidMount(): void {
    this.timer = setInterval(() => {
      const { timeLeft } = this.state;

      if (timeLeft < 0) {
        if (this.props.onFinish) {
          this.props.onFinish();
        }
        clearInterval(this.timer);
      }

      this.setState({ timeLeft: this.getTimeLeft() });
    }, 1000);
  }

  componentWillUnmount(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
    }
  }

  render(): React.ReactNode {
    const { timeLeft } = this.state;

    const computedDays = Math.floor(timeLeft / day);
    const computedHours = Math.floor((timeLeft % day) / hour);
    const computedMinutes = Math.floor((timeLeft % hour) / minute);
    const computedSeconds = Math.floor((timeLeft % minute) / second);

    return (
      <div
        className={cn(styles.counter, this.props.className)}
        data-test-id={this.props["data-test-id"]}
      >
        <Plate
          value={computedDays < 0 ? 0 : computedDays}
          label={<FormattedMessage id="counter.label.days" />}
        />
        {":"}
        <Plate
          value={computedHours < 0 ? 0 : computedHours}
          label={<FormattedMessage id="counter.label.hours" />}
        />
        {":"}
        <Plate
          value={computedMinutes < 0 ? 0 : computedMinutes}
          label={<FormattedMessage id="counter.label.minutes" />}
        />
        {":"}
        <Plate
          value={computedSeconds < 0 ? 0 : computedSeconds}
          label={<FormattedMessage id="counter.label.seconds" />}
        />
      </div>
    );
  }
}
