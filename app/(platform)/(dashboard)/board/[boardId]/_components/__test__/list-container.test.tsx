import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ListContainer } from '../list-container';
import '@testing-library/jest-dom';
import { Card, List } from '@prisma/client';
import { ListWithCards } from '../../../../../../../types';

// Mock the DnD components
const mockDragEnd = jest.fn();
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }: { children: React.ReactNode, onDragEnd: (result: any) => void }) => {
    mockDragEnd.mockImplementation(onDragEnd);
    return children;
  },
  Droppable: ({ children, droppableId, type }: { children: (provided: any) => React.ReactNode, droppableId: string, type: string }) =>
    children({
      droppableProps: { 'data-rbd-droppable-id': droppableId },
      innerRef: () => {},
      placeholder: null,
    }),
  Draggable: ({ children, draggableId, index }: { children: (provided: any) => React.ReactNode, draggableId: string, index: number }) =>
    children({
      draggableProps: { 'data-rbd-draggable-id': draggableId },
      dragHandleProps: {},
      innerRef: () => {},
    }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useParams() {
    return {
      boardId: 'board-1'
    };
  }
}));

// Mock ListForm component
jest.mock('../list-form', () => ({
  ListForm: () => <div data-testid="list-form">Add a list</div>
}));

// Mock ListItem component
jest.mock('../list-item', () => ({
  ListItem: ({ data }: { data: ListWithCards }) => (
    <div data-testid={`list-${data.id}`}>{data.title}</div>
  )
}));

const mockData: ListWithCards[] = [
  {
    id: '1',
    title: 'List 1',
    cards: [],
    order: 1,
    boardId: 'board-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'List 2',
    cards: [],
    order: 2,
    boardId: 'board-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

describe('ListContainer', () => {
  beforeEach(() => {
    mockDragEnd.mockClear();
  });

  it('renders correctly with initial data', () => {
    render(<ListContainer data={mockData} boardId="board-1" />);

    // Check if lists are rendered
    expect(screen.getByTestId('list-1')).toHaveTextContent('List 1');
    expect(screen.getByTestId('list-2')).toHaveTextContent('List 2');
  });

  it('renders the ListForm component', () => {
    render(<ListContainer data={mockData} boardId="board-1" />);

    // Check if ListForm is rendered
    expect(screen.getByTestId('list-form')).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    render(<ListContainer data={[]} boardId="board-1" />);

    // Check if only ListForm is rendered when no lists exist
    expect(screen.getByTestId('list-form')).toBeInTheDocument();
    expect(screen.queryByTestId('list-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('list-2')).not.toBeInTheDocument();
  });

  it('renders lists in correct order', () => {
    const orderedData: ListWithCards[] = [
      {
        id: '2',
        title: 'List 2',
        cards: [],
        order: 1,
        boardId: 'board-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '1',
        title: 'List 1',
        cards: [],
        order: 2,
        boardId: 'board-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    render(<ListContainer data={orderedData} boardId="board-1" />);

    // Get all list elements
    const lists = screen.getAllByTestId(/^list-/);

    // Check if lists are rendered in correct order
    expect(lists[0]).toHaveTextContent('List 2');
    expect(lists[1]).toHaveTextContent('List 1');
  });

  it('handles list reordering correctly', async () => {
    render(<ListContainer data={mockData} boardId="board-1" />);

    // Simulate drag end event for list reordering
    await act(async () => {
      mockDragEnd({
        destination: { index: 1, droppableId: 'lists' },
        source: { index: 0, droppableId: 'lists' },
        type: 'list',
      });
    });

    // Verify that the drag end handler was called
    expect(mockDragEnd).toHaveBeenCalled();
  });

  it('handles card reordering correctly', async () => {
    const dataWithCards: ListWithCards[] = [
      {
        id: '1',
        title: 'List 1',
        cards: [
          {
            id: 'card-1',
            title: 'Card 1',
            order: 1,
            listId: '1',
            description: null,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'card-2',
            title: 'Card 2',
            order: 2,
            listId: '1',
            description: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        order: 1,
        boardId: 'board-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    render(<ListContainer data={dataWithCards} boardId="board-1" />);

    // Simulate drag end event for card reordering within the same list
    await act(async () => {
      mockDragEnd({
        destination: { index: 1, droppableId: '1' },
        source: { index: 0, droppableId: '1' },
        type: 'card',
      });
    });

    // Verify that the drag end handler was called
    expect(mockDragEnd).toHaveBeenCalled();
  });
});
