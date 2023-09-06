import { EventItem } from "../../pages/content/components/Demo/utils";

export interface BettingRecordItem {
  id: string;
  flag: string;
  amount: number;
  createdTime: string;
  duration: string;
  teams: EventItem["teams"];
  isBetted?: boolean;
}
