import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { DroppableComponent, DraggableComponent, DragDropComponent } from './components';
import { getDragAbleLines, getItemsForLines, isCheckEven } from './utils';
import { EVEN_IN_FRONT_OF_EVEN_CAUTION_TEXT, FROM_FIRST_LINE_TO_THIRD_LINE_CAUTION_TEXT } from './constants';

const App = () => {
    const [items, setItems] = useState(getItemsForLines());
    const [dragAbleLines, setDragAbleLines] = useState(getDragAbleLines());
    const [selectedIds, setSelectedIds] = useState([]);
    const [cautionText, setCautionText] = useState('');
    const [selectedLine, setSelectedLine] = useState();

    const handleDragNotAbleLines = (lineNum) => {
        const nextSetDragAbleLines = Object.keys(dragAbleLines).reduce((prev, next) => {
            prev[next] = lineNum !== next;
            return prev;
        }, {});
        setDragAbleLines(nextSetDragAbleLines);
    };

    const reorder = (result) => {
        const _items = { ...items };
        const isMoveMulti = selectedIds.length;

        if (isMoveMulti) {
            handleMoveMulti(_items, result);
        } else {
            handleMoveOne(_items, result);
        }
        return _items;
    };

    const handleMoveOne = (_items, result) => {
        const sourceKey = result.source.droppableId;
        const destinationKey = result.destination.droppableId;
        const startIndex = result.source.index;
        let endIndex = result.destination.index;
        const [removed] = _items[sourceKey].splice(startIndex, 1);
        _items[destinationKey].splice(endIndex, 0, removed);
    };

    const handleMoveMulti = (_items, result) => {
        const sourceKey = result.source.droppableId;
        const destinationKey = result.destination.droppableId;
        const startIndex = result.source.index;
        let endIndex = result.destination.index;
        _items[sourceKey] = _items[sourceKey].reduce((prev, next) => {
            if (selectedIds.includes(next)) {
                return prev;
            }
            return [...prev, next];
        }, []);
        const isMoveInSameLine = sourceKey === destinationKey;
        const countSmallerIndexThanEndIndexInSelectedIds = items[sourceKey].reduce((prev, next, index) => {
            const isNotInSelectedIds = !selectedIds.includes(next);
            if (isNotInSelectedIds) {
                return prev;
            }
            return index < endIndex ? prev + 1 : prev;
        }, 0);
        if (isMoveInSameLine) {
            const isMoveDown = startIndex < endIndex;
            endIndex = Math.max(0, endIndex - countSmallerIndexThanEndIndexInSelectedIds);
            if (isMoveDown) {
                endIndex++;
            }
        }
        _items[destinationKey].splice(endIndex, 0, ...selectedIds);
    };

    const onDragEnd = useCallback(
        (result) => {
            if (!result.destination) {
                return;
            }
            setItems(reorder(result));
            setSelectedIds([]);
        },
        [selectedIds]
    );

    const onDragUpdate = (result) => {
        const destination = result.destination;

        if (!destination) {
            return;
        }
        const isMoveMulti = selectedIds.length;
        if (isMoveMulti) {
            const sourceKey = result.source.droppableId;
            const sourceIndex = result.source.index;
            const moveItem = items[sourceKey][sourceIndex];

            if (!selectedIds.includes(moveItem)) {
                setSelectedIds([...selectedIds, moveItem]);
            }
        }

        const fromLine = result.source.droppableId;
        const toLine = result.destination.droppableId;
        const fromIndex = result.source.index;
        let destinationIndex = result.destination.index;
        const isFromFirstLineToThirdLine = fromLine === 'line-0' && toLine === 'line-2';
        let isMoveEvenInFrontOfEven = false;
        const hasItemDestinationIndex = items[toLine][destinationIndex];
        if (hasItemDestinationIndex) {
            const isMoveDownInSameLine = fromLine === toLine && fromIndex < destinationIndex;
            if (isMoveDownInSameLine) {
                destinationIndex++;
            }
            const fromItemId = selectedIds.length ? selectedIds[selectedIds.length - 1].id : items[fromLine][fromIndex].id;
            const destinationItemsLength = items[toLine].length;
            if (destinationIndex < destinationItemsLength) {
                const toItemId = items[toLine][destinationIndex].id;
                const moveItemNum = convertItemIdToInt(fromItemId);
                let destinationNextItemNum = convertItemIdToInt(toItemId);
                isMoveEvenInFrontOfEven =
                    moveItemNum !== destinationNextItemNum && isCheckEven(moveItemNum) && isCheckEven(destinationNextItemNum);
            }
        }

        if (isMoveEvenInFrontOfEven || isFromFirstLineToThirdLine) {
            setCautionText(
                isMoveEvenInFrontOfEven
                    ? EVEN_IN_FRONT_OF_EVEN_CAUTION_TEXT
                    : isFromFirstLineToThirdLine
                    ? FROM_FIRST_LINE_TO_THIRD_LINE_CAUTION_TEXT
                    : ''
            );
            handleDragNotAbleLines(toLine);
        } else {
            handleDragNotAbleLines();
        }
    };

    const convertItemIdToInt = (itemId) => {
        return parseInt(itemId.replace('item-', ''));
    };

    const onClick = (item, lineIndex) => {
        let nextSelectedIds = [...selectedIds];
        if (lineIndex !== selectedLine) {
            nextSelectedIds = [];
        }
        if (nextSelectedIds.length && nextSelectedIds.includes(item)) {
            nextSelectedIds = nextSelectedIds.reduce((prev, next) => {
                if (next.id === item.id) {
                    return prev;
                }
                return [...prev, next];
            }, []);
        } else {
            nextSelectedIds.push(item);
        }
        setSelectedLine(lineIndex);
        setSelectedIds(nextSelectedIds);
    };

    const getSelectedMap = useMemo(() => {
        if (!selectedIds.length) {
            return {};
        }
        return selectedIds.reduce((previous, current) => {
            previous[current.id] = true;
            return previous;
        }, {});
    }, [selectedIds]);

    return (
        <DragDropComponent onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} handleDragNotAbleLines={handleDragNotAbleLines}>
            {Object.keys(items).map((key, lineIndex) => {
                const isDragAble = dragAbleLines[key];
                return (
                    <DroppableComponent isDragAble={isDragAble} droppableId={key} key={key} cautionText={cautionText}>
                        {items[key].map((item, itemIndex) => {
                            const isSelected = Boolean(getSelectedMap[item.id]);
                            const selectedIndex = selectedIds?.indexOf(item);
                            return (
                                <DraggableComponent
                                    item={item}
                                    isSelected={isSelected}
                                    onClick={onClick}
                                    key={`${key}-${item.id}`}
                                    droppableId={`${key}-${item.id}`}
                                    lineIndex={lineIndex}
                                    itemIndex={itemIndex}
                                    selectedIndex={selectedIndex !== -1 ? selectedIndex + 1 : undefined}
                                />
                            );
                        })}
                    </DroppableComponent>
                );
            })}
        </DragDropComponent>
    );
};

export default App;
