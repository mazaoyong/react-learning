import { TeamEventsItem } from "./components/Sofascore";
import { CLASS_NAME, MATCH_NAME } from "./constants";
import _ from "lodash";

export type EventItem = {
  // 赛事名称
  name: string;
  // 队伍
  teams: Array<{
    // 队伍名称
    name: string;
    // 比分
    score: number;
    // 赔率
    odds: number;
  }>;
  // 持续时间，单位：分钟
  duration: string;
};

export type Sport = {
  // 体育项目名称
  name: string;
  // 赛事列表
  eventList: Array<EventItem>;
};

// 获得dom的文本内容
export const getDomTextContent = (dom: Element) => {
  return dom?.textContent || "";
};

// 获得多个dom的文本内容
export const getDomTextContentList = (domList: NodeListOf<Element>) => {
  if (!domList?.length) {
    return [];
  }
  return Array.from(domList).map((dom) => getDomTextContent(dom));
};

export const trasformGridLineDom = (_gridLineDom: Element): Sport => {
  const eventListDom = _gridLineDom.querySelectorAll(CLASS_NAME.eventList);
  const eventList: EventItem[] = Array.from(eventListDom).map(
    (EventItemDom) => {
      // 赛事名称
      const eventNameDom = EventItemDom.querySelector(CLASS_NAME.eventName);
      // 比赛持续时间
      const eventTimeDom = EventItemDom.querySelector(CLASS_NAME.eventTime);
      // 队伍名称
      const eventTeamDom = EventItemDom.querySelectorAll(CLASS_NAME.eventTeam);
      const teamNames = getDomTextContentList(eventTeamDom);
      // 比分
      const teamScores = getDomTextContentList(
        EventItemDom.querySelectorAll(CLASS_NAME.eventScore)
      ).map((i) => Number(i));

      // 赔率
      const oddsList: number[] = [];
      const eventOddsDom = EventItemDom.querySelectorAll(CLASS_NAME.eventOdds);
      eventOddsDom.forEach((oddsDom) => {
        const outcomeStatus = getDomTextContent(
          oddsDom.querySelector(CLASS_NAME.outcomeStatus)
        );
        const outcomeNumber = Number(
          getDomTextContent(oddsDom.querySelector(CLASS_NAME.outcomeNumber))
        );
        switch (outcomeStatus) {
          case "1":
            oddsList[0] = outcomeNumber;
            break;
          case "2":
            oddsList[1] = outcomeNumber;
        }
      });

      return {
        name: getDomTextContent(eventNameDom),
        duration: getDomTextContent(eventTimeDom),
        teams: teamNames.map((name, index) => ({
          name,
          score: teamScores[index],
          odds: oddsList[index],
        })),
      };
    }
  );
  return {
    name: MATCH_NAME,
    eventList,
  };
};

// 通过最近五场的比分获取平均进球
export const getAverageScore = (events: Array<TeamEventsItem>, id: number) => {
  const RECENT_EVENTS_COUNT = 5;
  // 最近五场比赛
  const recentEvents = _.orderBy(
    _.filter(events, (o) => !_.isEmpty(o.time)),
    ["time.currentPeriodStartTimestamp"],
    ["desc"]
  ).slice(0, RECENT_EVENTS_COUNT);

  // 总进球数
  let totalScore = 0;
  // 总失球数
  let totalLoseScore = 0;
  recentEvents.forEach((item) => {
    if (item.homeTeam.id === id) {
      totalScore += item.homeScore.current * 1.5;
      totalLoseScore += item.awayScore.current * 1.5;
    } else if (item.awayTeam.id === id) {
      totalScore += item.awayScore.current * 2;
      totalLoseScore += item.homeScore.current * 1;
    }
  });

  console.log(33, id, recentEvents, totalScore, totalLoseScore);

  return {
    totalScore,
    totalLoseScore,
    averScore: totalScore / RECENT_EVENTS_COUNT,
    averLoseScore: totalLoseScore / RECENT_EVENTS_COUNT,
  };
};

/**
 * Royal: _1-0 1-_1 _6-0 1-_0 _1-0
 * 1.5 + 2 + 9 + 0 + 1.5 = 14 / 5 = 2.8;
 * 0 + 1 + 0 + 1 + 0 = 2 / 5 = 0.4;
 * Aek: _1-1 1-_0 _2-2 1-_2 1-_3
 * 1.5 + 0 + 3 + 4 + 6 = 14.5 / 5 = 2.9;
 * 1.5 + 1 + 3 + 1 + 1 = 7.5 / 5 = 1.5;
 *
 * 2.8 + 1.5 = 4.3 /2 = 2.15
 * 0.4 + 2.9 = 3.3 / 2 = 1.55
 *
 * 2.15 + 1.65 = 3.8 / 2 = 1.9
 */

/**
 * Sapporo: 2-_2 3-_0 _1-1 3-_0 1-_0
 * 4 + 0 + 1.5 + 0 + 0 = 5.5 / 5 = 1.1;
 * 2 + 3 + 1.5 + 3 + 1 = 10.5 / 5 = 2.1;
 * Gamba: 1-_1 _2-1 2-_1 3-_4 _0-1
 * 2 + 3 + 2 + 8 + 0 = 15 / 5 = 3;
 * 1 + 1.5 + 2 + 3 + 1.5 = 9 / 5 = 1.8;
 *
 * 1.1 + 1.8 = 2.9 /2 = 1.45
 * 2.1 + 3 = 5.1 / 2 = 2.55
 *
 * 1.45 + 2.55 = 4 / 2 = 2
 */
