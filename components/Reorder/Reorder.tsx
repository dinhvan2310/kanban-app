import { Reorder } from 'framer-motion';
import React from 'react'

interface ReorderProps<T> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (item: T) => React.ReactNode;
}

function ReorderComponent<T extends {
    key: string
}>({
    items,
    onReorder,
    renderItem
}: ReorderProps<T>) {
    return (
        <Reorder.Group<T> axis="y" values={items} onReorder={onReorder}>
            {items.map((item) => (
                <Reorder.Item key={item.key} value={item}>
                    {renderItem(item)}
                </Reorder.Item>
            ))}
        </Reorder.Group>
    )
}

export default ReorderComponent