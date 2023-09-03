import React, { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${props => (props.isDragging ? '#0773E0' : '#fff')};
  box-shadow: ${props => (props.isDragging ? '0px 2px 5px rgba(0,0,0,0.05)' : 'none')};
`;

const DragabbleCard = ({ toDoId, toDoText, index }: IDragabbleCardProps) => {
  return (
    // 드래그 할 요소를 감싼다.
    // index는 드래그해서 자리를 옮길때 필요한 순서, 고유한 값이여야함
    <Draggable key={toDoId} draggableId={String(toDoId)} index={index}>
      {/* provided 드래그드롭중에 droppable의 면적이 변화하게 된다면 해당부분을 처리해주는 엘리먼트 */}
      {/* snapshot 스타일에 유용하게 사용되는 엘리먼트*/}
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging} // 제가 드래그 되고 있나요?
          ref={provided.innerRef} // DOM 노드를 조회하지 않기 위해서 지정 (필수)
          {...provided.draggableProps} //  draggable로 사용할 컴포넌트에 필요한 props를 모아 놓은 것
          {...provided.dragHandleProps} // 해당 props를 가진 컴포넌트가 drag에 사용될 손잡이 역할
        >
          <span>✅ {toDoText}</span>
        </Card>
      )}
    </Draggable>
  );
};

export default memo(DragabbleCard);
