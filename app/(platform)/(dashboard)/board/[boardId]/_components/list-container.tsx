"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // user moves the list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => {
          return {
            ...item,
            order: index,
          };
        }
      );
      setOrderedData(items);
      // TODO: Trigger server action
    }

    // user moves the card

    if (type === "card") {
      let newOrderData = [...orderedData];

      // source and destination list
      const sourceList = newOrderData?.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderData?.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exists on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on the destination list
      if (!destList.cards) {
        destList.cards = [];
      }

      // moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card,idx) => {
          card.order = idx;
        })

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderData);
        // TODO: Trigger server action

        // user moves the card to another list
      } else {
        // remove the card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        // assign the new listId to the moved card
        movedCard.listId = destination.droppableId;
        // add the card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);
        // update the order for each card in the source list
        sourceList.cards.forEach((card,idx) => {
          card.order = idx;
        })

        // update the order for each card in the destination list
        destList.cards.forEach((card,idx) => {
          card.order = idx;
        })

        setOrderedData(newOrderData);
        // TODO: Trigger server action
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData?.map((list, index) => {
              return <ListItem key={list?.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// 8:52
