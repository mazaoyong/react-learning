import { useAsyncEffect, useInterval } from "ahooks";
import React from "react";
import { getAverageScore } from "../utils";
import numbro from "numbro";
import _ from "lodash";

const ID_KEY = "temp";

type TeamInfo = {
  name: string;
  id: number;
  slug: string;
  shortName: string;
};

type TeamScore = {
  current: number;
};

export type TeamEventsItem = {
  // 主场球队信息
  homeTeam: TeamInfo;
  // 主场球队进球
  homeScore: TeamScore;
  // 客场球队信息
  awayTeam: TeamInfo;
  // 客场球队进球
  awayScore: TeamScore;
  time: {
    currentPeriodStartTimestamp: number;
  };
};

type TeamEventsApi = {
  events: Array<TeamEventsItem>;
};

const fetchTeamEvents = (id: number) => {
  return fetch(
    `https://api.sofascore.com/api/v1/team/${id}/events/last/0`
  ).then((res) => res.json());
};

let handleCount = 0;

const teamsEventsMap = new Map<number, TeamEventsApi>();

const Sofascore = () => {
  const [liveScoreDomArr, setLiveScoreDomArr] =
    React.useState<NodeListOf<Element>>();
  const [isDone, setIsDone] = React.useState(true);

  useAsyncEffect(async () => {
    if (liveScoreDomArr?.length) {
      for (const item of liveScoreDomArr) {
        // 获取两支队伍的id和名称
        const teams = item.querySelectorAll(`div[display='flex']`);
        const teamInfo = [...teams].map((team) => {
          const teamName = team.querySelector("bdi").textContent;
          const idReg = /team\/([0-9]+)\//;
          const id = team.querySelector("img").src.match(idReg)?.[1];
          return {
            id: +id,
            name: teamName,
          };
        });

        const tempDivEle = item.querySelector(`div[data-flag='${ID_KEY}']`);
        if (tempDivEle) {
          // tempDivEle.innerHTML = "hello22";
        } else {
          // 通过接口获取队伍的数据
          const [team_1, team_2] = await Promise.all(
            teamInfo.map(async (team) => {
              let data = teamsEventsMap.get(team.id);
              if (!teamsEventsMap.has(team.id)) {
                data = await fetchTeamEvents(team.id);
                teamsEventsMap.set(team.id, data);
              }
              // return getAverageScore(data.events, team.id);

              // TODO：测试用
              const arr = _.orderBy(
                data.events.filter((item) => !_.isEmpty(item.time)),
                ["time.currentPeriodStartTimestamp"],
                ["desc"]
              );
              return getAverageScore(arr.slice(1), team.id);
            })
          );
          // 通过两支队伍最近五场的比分计算本次比赛的进球数量
          const a = numbro(team_1.averScore)
            .add(team_2.averLoseScore)
            .divide(2);
          const b = numbro(team_2.averScore)
            .add(team_1.averLoseScore)
            .divide(2);
          const c = a.add(b.value()).divide(2).value();

          console.log(a, b, c);

          const divEle = document.createElement("div");
          divEle.setAttribute("data-flag", ID_KEY);
          divEle.setAttribute(
            "style",
            `
            position:absolute;
            right:0;
            top:50%;
            transform:translateY(-50%);
            font-size:12px;
          `
          );
          divEle.innerHTML = `进球预期：${c}`;
          item.setAttribute("style", "position:relative");
          item.appendChild(divEle);
        }
        handleCount += 1;
      }
      if (handleCount === liveScoreDomArr.length) {
        setIsDone(true);
      }
    }
  }, [liveScoreDomArr]);

  const isSofascore = React.useMemo(() => {
    if (typeof window !== "undefined") {
      return location.href.includes("www.sofascore.com/en-us/soccer/");
    }
    return false;
  }, []);

  useInterval(() => {
    if (isSofascore && isDone) {
      const liveScore = document.querySelectorAll("div[title*='live score']");
      handleCount = 0;
      setLiveScoreDomArr(liveScore);
      setIsDone(false);
    }
  }, 3000);

  return null;
};

export default Sofascore;
