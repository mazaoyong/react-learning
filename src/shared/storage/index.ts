import createStorageLocal from "./helper";
import { BettingRecordItem } from "./types";

export const storageDataMap = {
  bettingRecord: [] as BettingRecordItem[],
};

export default createStorageLocal(storageDataMap);
