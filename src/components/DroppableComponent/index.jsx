import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { GRID } from '../../constants';

const cautionContainer = (isDragAble) => ({
    fontSize: 12,
    color: '#FFFAE6',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    visibility: isDragAble ? 'hidden' : 'visible',
    display: 'flex',
    zIndex: 10,
    pointerEvents: 'none',
    whiteSpace: 'pre-line',
});

const getListStyle = (isDraggingOver, isDragAble) => ({
    position: 'relative',
    background: isDraggingOver ? '#91DDCF' : isDragAble ? '#667BC6' : '#F19ED2',
    padding: GRID,
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    overflow: 'hidden',
});

const DroppableComponent = ({ isDragAble, droppableId, cautionText, children }) => {
    return (
        <Droppable droppableId={droppableId} isDropDisabled={!isDragAble}>
            {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, isDragAble)}>
                    <div style={cautionContainer(isDragAble)}>{!isDragAble ? cautionText : ''}</div>

                    <div style={{ overflow: 'scroll' }}>
                        {children}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

export default DroppableComponent;
