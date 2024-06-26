import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GRID } from '../../constants';

const DraggableComponent = ({ item, isSelected, droppableId, itemIndex, lineIndex, onClick, selectedIndex }) => {
    return (
        <Draggable draggableId={droppableId} index={itemIndex}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, isSelected)}
                    onClick={() => {
                        onClick(item, lineIndex);
                    }}
                >
                    {item.content}
                    {selectedIndex && <div style={selectedIndexContainer}>{selectedIndex}</div>}
                </div>
            )}
        </Draggable>
    );
};

const getItemStyle = (isDragging, draggableStyle, isSelected) => ({
    userSelect: 'none',
    padding: GRID * 2,
    margin: `0 0 ${GRID}px 0`,
    background: isSelected ? '#FFB4C2' : isDragging ? '#EEEDEB' : '#FDFFD2',
    borderRadius: '10px',
    color: 'black',
    position: 'relative',
    display: 'flex',
    ...draggableStyle,
});

const selectedIndexContainer = {
    position: 'absolute',
    display: 'flex',
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#667BC6',
    fontSize: 10,
    color: '#FDFFD2',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
};

export default DraggableComponent;
