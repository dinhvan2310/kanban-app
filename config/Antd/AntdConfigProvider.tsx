"use client";

import React, {PropsWithChildren} from "react";
import { ConfigProvider, theme } from "antd";

export default function AntdConfigProvider({children}: PropsWithChildren) {

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
            }}
        >
            {children}
        </ConfigProvider>
    );
}
