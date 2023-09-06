import { proxy } from "valtio";
import { default as storage } from "../storage";
import { BettingRecordItem } from "../storage/types";

const store = proxy({
  bettingRecordMap: new Map() as Map<string, BettingRecordItem>,
  setBettingRecordMap: async (
    _bettingRecordMap: Map<string, BettingRecordItem>
  ) => {
    await storage.bettingRecord.set([..._bettingRecordMap.values()]);
    store.bettingRecordMap = _bettingRecordMap;
  },
});

const initData = async () => {
  const bettingRecord = await storage.bettingRecord.get();
  store.bettingRecordMap = new Map(
    bettingRecord.map((item) => [item.flag, item])
  );
};

initData();

export default store;
