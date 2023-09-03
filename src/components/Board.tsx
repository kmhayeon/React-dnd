import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DragabbleCard from './DragabbleCard';
import { ITodo, toDoState } from '../recoil/atoms';
import { useSetRecoilState } from 'recoil';

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: #dfe6e9;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
  background-color: ${props => (props.isDraggingOver ? '#dfe6e9' : props.isDraggingFromThis ? '#b2bec3' : 'transparent')};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

const Board = ({ toDos, boardId }: IBoardProps) => {
  // 리코일 내부에 있는 데이터
  const setToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  // 폼에 입력된 내용 추가
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos(allBoards => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue('toDo', '');
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        {/* react-hook-form 관련 설정 :: register 함수를 사용하여 각 입력 필드를 등록하고, 유효성 검사 규칙을 설정 */}
        <input {...register('toDo', { required: true })} type="text" placeholder={`ADD task on ${boardId}`} />
      </Form>
      {/* Droppable는 드롭할 수 있는 공간 설정이며, droppableId는 고유한 아이디여야한다.(필수)  */}
      <Droppable droppableId={boardId}>
        {/* provided 드래그드롭중에 droppable의 면적이 변화하게 된다면 해당부분을 처리해주는 엘리먼트(필수) */}
        {/* snapshot 스타일에 유용하게 사용되는 엘리먼트 */}
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver} // 드래그 요소가 내위에 있나요?
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)} // 여기서 출발하는 drag요소의 ID가 뭐에요? === draggableId
            ref={provided.innerRef} // // DOM 노드를 조회하지 않기 위해서 지정, 추가된
            {...provided.droppableProps} // draggable로 사용할 컴포넌트에 필요한 props를 모아 놓은 것, 받은 props
          >
            {toDos.map((toDo, index) => {
              return <DragabbleCard key={toDo.id} toDoId={toDo.id} toDoText={toDo.text} index={index} />;
            })}

            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Board;
