import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { toDoState } from '../recoil/atoms';
import Board from './Board';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

function DndContainer() {
  // 리코일 내부에 있는 데이터
  const [toDos, setToDos] = useRecoilState(toDoState);

  // Draggable이 Droppable로 드래그 되었을 때 실행되는 이벤트 (필수) / 드래그가 끝나면 작동할 함수, DragDropContext에 연결된다.
  const onDragEnd = (info: DropResult) => {
    // destination이 끝 위치, source가 시작 위치를 의미함
    const { destination, draggableId, source } = info;

    // 유효하지 않는 곳으로 drag시 이벤트를 종료한다.
    if (!destination) return;

    // console.log('source ====', source);
    // console.log('draggableId ====', draggableId);

    // 원래 같은 자리에 가져다 두었다면
    if (destination?.droppableId === source.droppableId) {
      setToDos(allBoards => {
        const boardCopy = [...allBoards[source.droppableId]]; // 깊은 복사
        const taskObj = boardCopy[source.index];

        //  해당 array를 splic해서 새로 넣는 작업
        // drag를 시작한 리스트에서 drag한 아이템을 뺀다.
        boardCopy.splice(source.index, 1);
        // drop되는 리스트에 알맞는 위치에 아이템을 추가해준다.
        boardCopy.splice(destination?.index, 0, taskObj);

        return {
          // 상태 변경
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }

    // 다른 자리에 가져다 두었다면
    if (destination?.droppableId !== source.droppableId) {
      setToDos(allBoards => {
        const sourceBoard = [...allBoards[source.droppableId]]; // 깊은 복사
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];

        //  해당 array를 splic해서 새로 넣는 작업
        // drag를 시작한 리스트에서 drag한 아이템을 뺀다.
        sourceBoard.splice(source.index, 1);
        // drop되는 리스트에 알맞는 위치에 아이템을 추가해준다.
        destinationBoard.splice(destination?.index, 0, taskObj);

        return {
          // 상태 변경 / 기존 state와 새롭게 바뀐 정보를 넣어 새 state로 만듦
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  return (
    // 드래그, 드롭할 전체 영역
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map(boardId => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default DndContainer;
