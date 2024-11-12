import useToken from 'antd/es/theme/useToken';
import React from 'react';
import MenuItem from './MenuItem';
import { Typography } from 'antd';

export interface MenuItemType {
    key?: string;
    type: 'item' | 'divider' | 'custom';
    label?: string;
    title?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    renderCustom?: (inlineCollapsed: boolean) => React.ReactNode;
}

interface SidebarMenuProps {
    inlineCollapsed: boolean;
    selectedKey: string;
    items: MenuItemType[];
    onPress?: (key: string, e: React.MouseEvent) => void;
}

function SidebarMenu({
    inlineCollapsed = false,
    selectedKey,
    items,
    onPress
}: SidebarMenuProps) {
    const token = useToken();
    return (
        <ul className="p-2 m-0 list-none">
            {items.map((item, index) => {
                if (item.type === "divider") {
                    return (
                        <div
                            key={'divider' + index}
                            className="h-px my-1"
                            style={{
                                backgroundColor: token[3].colorBorder,
                            }}
                        />
                    );
                }
                if (item.type === 'item') return (
                    <MenuItem
                        key={item.key}
                        active={selectedKey === item.key}
                        inlineCollapsed={inlineCollapsed}
                        item={item}
                        onPress={onPress}
                    />
                )
                if (item.type === 'custom') return (
                    <div
                        key={'custom' + index}
                        className={`flex flex-col cursor-default`}
                    >
                        <Typography.Text
                            type="secondary"
                            title={item.title}
                            ellipsis={true}
                            className='py-1 px-2'
                        >
                            {item.label}
                        </Typography.Text>

                        <div className="p-0 m-0 list-none">
                            {item.renderCustom && item.renderCustom(inlineCollapsed)}
                        </div>
                    </div>
                )
            })}
        </ul>
    )
}

export default SidebarMenu