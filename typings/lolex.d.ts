import { TimerId, LolexClock } from "lolex";

export interface LolexClockAsync<TTimerId extends TimerId> extends LolexClock<TTimerId> {
  tickAsync(time: number | string): Promise<void>;
}
