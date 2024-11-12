'use client'
import { cn } from "@/lib/utils";
import { Divider, Row, Skeleton, Space } from "antd";
import useToken from "antd/es/theme/useToken";

export default function Loading() {
  const token = useToken();
  return (
    <div
      className={cn(
        `w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0`,
        {},
      )}
      style={{
        backgroundColor: token[3].colorBgContainer,
        borderColor: token[3].colorBorder,
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
        <Row justify={"space-between"}>
          <Skeleton.Input />
          <Skeleton.Input size={"small"} />
        </Row>
        <Space direction="vertical" className="w-full">
          <Space direction="vertical" className="w-full">
            <Skeleton.Input active={true} block={true} size="large" />
            <Skeleton.Input active={true} block={true} size="large" />
            <Skeleton.Input active={true} block={true} size="large" />
          </Space>
          <Row justify={"end"} className="mt-4 mb-4">
            <Skeleton.Input active size={"default"} />
          </Row>
          <Divider type="horizontal" />
          <Space
            direction="vertical"
            className="w-full"
          >
            <Skeleton.Button active size={"large"} block />
            <Skeleton.Button active size={"large"} block />
            <Skeleton.Button active size={"large"} block />
          </Space>
        </Space>
      </div>
    </div>
  )
}