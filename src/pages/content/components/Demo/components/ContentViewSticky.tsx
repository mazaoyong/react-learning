import React from "react";
import { Space, Modal, List, Collapse } from "antd";
import { useSnapshot } from "valtio";
import store from "@src/shared/store";
import { BettingRecordItem } from "@root/src/shared/storage/types";
import _ from "lodash";

const ContentViewSticky: React.FC = () => {
  const { bettingRecordMap, setBettingRecordMap } = useSnapshot(store);
  const [data_1, data_2] = _.partition(
    [...bettingRecordMap.values()],
    (item) => item.isBetted
  );
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <Collapse
        className="left-top-collapse"
        items={[
          {
            key: "1",
            label: "折叠面板",
            children: (
              <List<BettingRecordItem>
                dataSource={data_2}
                bordered
                rowKey="id"
                size="small"
                loading={loading}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <span
                        style={{
                          userSelect: "text",
                        }}
                      >
                        {item.flag}
                      </span>
                      <a
                        href="#"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            bettingRecordMap.set(item.flag, {
                              ...item,
                              isBetted: true,
                            });
                            await setBettingRecordMap(bettingRecordMap);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        style={{
                          color: "blue",
                        }}
                      >
                        设置
                      </a>
                      <a
                        href="#"
                        style={{ color: "red" }}
                        onClick={() => {
                          Modal.confirm({
                            title: `确认要删除 ${item.flag} 吗？`,
                            onOk: async () => {
                              setLoading(true);
                              try {
                                bettingRecordMap.delete(item.flag);
                                await setBettingRecordMap(bettingRecordMap);
                              } finally {
                                setLoading(false);
                              }
                            },
                          });
                        }}
                      >
                        删除
                      </a>
                    </Space>
                  </List.Item>
                )}
              ></List>
            ),
          },
          {
            key: "2",
            label: "折叠面板",
            children: (
              <List<BettingRecordItem>
                dataSource={data_1}
                bordered
                rowKey="id"
                size="small"
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <span
                        style={{
                          userSelect: "text",
                        }}
                      >
                        {item.flag}
                      </span>
                      <a
                        href="#"
                        onClick={async () => {
                          bettingRecordMap.set(item.flag, {
                            ...item,
                            isBetted: false,
                          });
                          await setBettingRecordMap(bettingRecordMap);
                        }}
                        style={{
                          color: "blue",
                        }}
                      >
                        取消
                      </a>
                      <a
                        href="#"
                        style={{ color: "red" }}
                        onClick={() => {
                          Modal.confirm({
                            title: `确认要删除 ${item.flag} 吗？`,
                            onOk: async () => {
                              setLoading(true);
                              try {
                                bettingRecordMap.delete(item.flag);
                                await setBettingRecordMap(bettingRecordMap);
                              } finally {
                                setLoading(false);
                              }
                            },
                          });
                        }}
                      >
                        删除
                      </a>
                    </Space>
                  </List.Item>
                )}
              ></List>
            ),
          },
        ]}
      />
    </>
  );
};

export default ContentViewSticky;
