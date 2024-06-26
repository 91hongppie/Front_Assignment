import React, { useEffect, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { GRID } from '../../constants';

const DragDropComponent = ({ children, onDragEnd, onDragUpdate, handleDragNotAbleLines }) => {
    const ref = useRef(null);

    useEffect(() => {
        ref?.current?.addEventListener('mouseup', () => {
            handleDragNotAbleLines();
        });
    }, []);

    return (
        <div style={containerStyle}>
            <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                <div style={contentStyle} ref={ref}>
                    {children}
                </div>
            </DragDropContext>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
};

const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    width: '90%',
    height: '90%',
    padding: GRID,
};

export default DragDropComponent;
