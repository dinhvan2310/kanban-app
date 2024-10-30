import React from "react";

export interface MenuItemGroupType {
    type: "group-item";
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    title?: string;
    disabled?: boolean;
}

export interface MenuItemType {
    type: "item" | "divider" | "group" | "group-item";

    key: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    title?: string;

    // group
    children?: MenuItemGroupType[];
    isOrderable?: boolean;
    onOrderChange?: (newOrder: string[]) => void;
    footer?: React.ReactNode;
}

interface MenuProps {
    items: MenuItemType[];
    selectedKey: string;
    inlineCollapsed: boolean;
    onClick: (
        key: string,
        domEvent: React.MouseEvent<HTMLElement>,
        groupKey?: string
    ) => void;
}

const MenuComponent = ({ type }: MenuProps) => {
    return <div>MenuComponent</div>;
};

export default MenuComponent;
