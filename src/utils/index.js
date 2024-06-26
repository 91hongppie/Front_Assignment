import { COLUMN_NUM } from '../constants';

const getItems = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `item-${k}`,
        content: `item ${k}`,
    }));
const getItemsForLines = () => {
    const itemsForLines = {};
    for (let i = 0; i < COLUMN_NUM; i++) {
        itemsForLines[`line-${i}`] = i === 0 ? getItems(10) : [];
    }
    return itemsForLines;
};
const getDragAbleLines = () => {
    const dragAbleLines = {};
    for (let i = 0; i < COLUMN_NUM; i++) {
        dragAbleLines[`line-${i}`] = true;
    }
    return dragAbleLines;
};

const isCheckEven = (num) => {
    if (num === 0) {
        return false;
    }
    return num % 2 === 0;
};

export { getItemsForLines, getDragAbleLines, isCheckEven };
