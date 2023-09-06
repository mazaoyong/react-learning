import { useAsyncEffect, useInterval, useTimeout } from "ahooks";
import {
  BET_AMOUNT_BASE,
  CLASS_NAME,
  MATCH_NAME,
  MIN_BET_AMOUNT,
  ODDS_DIFF,
} from "./constants";
import React from "react";
import { Sport, trasformGridLineDom } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { BettingRecordItem } from "@root/src/shared/storage/types";
import ContentViewSticky from "./components/ContentViewSticky";
import { useSnapshot } from "valtio";
import store from "@root/src/shared/store";
import Sofascore from "./components/Sofascore";

// 1.5分钟
const REFRESH_DELAY = 1000 * 60 * 1.5;

export default function App() {
  const [sportData, setSportData] = React.useState<Sport>();
  const [refreshDelay, setRefreshDelay] = React.useState(undefined);
  const { bettingRecordMap, setBettingRecordMap } = useSnapshot(store);

  // 如果页面数据5分钟内都没有变化的话就刷新页面
  useTimeout(() => {
    window.location.reload();
  }, refreshDelay);

  useInterval(() => {
    if (window) {
      const gridLine = document.querySelectorAll(CLASS_NAME.gridLine);
      const arr = [];
      const gridLineTargetDom = Array.from(gridLine).find((item) => {
        arr.push(trasformGridLineDom(item));
        const matchName = item.querySelector(
          CLASS_NAME.gridLineTitle
        )?.textContent;
        return matchName === MATCH_NAME;
      });
      if (gridLine && gridLineTargetDom) {
        const newSportData = trasformGridLineDom(gridLineTargetDom);
        const isSame =
          JSON.stringify(newSportData) === JSON.stringify(sportData);
        setRefreshDelay(isSame ? REFRESH_DELAY : undefined);
        setSportData(newSportData);
        console.log("下注情况：", bettingRecordMap);
      }
    }
  }, 3000);

  // 下注
  useAsyncEffect(async () => {
    for (const eventItem of sportData?.eventList || []) {
      const { duration, name, teams } = eventItem || {};
      if (teams.length === 0) {
        continue;
      }
      const [team_1, team_2] = teams || [];
      const flag = `${name}_${team_1.name}_${team_2.name}_${team_1.score}_${team_2.score}`;
      // 已经下注、平局且不为0、没有赔率都跳过
      if (
        bettingRecordMap.has(flag) ||
        !(team_1.odds && team_2.odds) ||
        (team_1.score !== 0 && team_1.score === team_2.score)
      ) {
        continue;
      }
      const newBettingItem: BettingRecordItem = {
        amount: 0,
        flag,
        id: uuidv4(),
        createdTime: new Date() + "",
        duration,
        teams,
      };
      // 分数差距绝对值
      const scoreDiff = Math.abs(team_1.score - team_2.score);
      // 赔率差距绝对值
      const oddsDiff = Math.abs(team_1.odds - team_2.odds);
      // 判断正负
      const scoreDiffSign = team_1.score > team_2.score ? 1 : -1;

      if (scoreDiff >= 2) {
        // 第一种情况：分数差距大于2，注意赔率小于1会出现undefined，全程生效
        const amount = Math.pow(BET_AMOUNT_BASE, scoreDiff - 1);
        newBettingItem.amount = scoreDiffSign * amount;
      } else if (
        Number(duration.match(/'([0-9]+$)/)?.[1]) >= 85 &&
        scoreDiff > 0
      ) {
        // 第二种情况：85分钟之后，谁领先就投谁
        let amount = BET_AMOUNT_BASE;
        // 第三种情况：分数差距大于2，翻倍投
        if (scoreDiff >= 2) {
          amount = Math.pow(BET_AMOUNT_BASE, scoreDiff);
        }
        newBettingItem.amount = scoreDiffSign * amount;
      }

      if (newBettingItem.amount === 0) {
        // console.log("下注异常情况：", newBettingItem);
      } else {
        bettingRecordMap.set(flag, newBettingItem);
        await setBettingRecordMap(bettingRecordMap);
        console.log("成功下注：", newBettingItem);
      }
    }
  }, [sportData]);

  console.log("赛况：", sportData);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 9999,
        background: "white",
      }}
    >
      {/* <ContentViewSticky></ContentViewSticky> */}
      {/* <Sofascore></Sofascore> */}
    </div>
  );
}
