export type ToDoItem = {
  id: string;
  text: string;
  deadline: string;
  isDone: boolean;
  title: string;
  listId: string;
};

export type NewToDoItem = {
  text: string;
  deadline: string;
  isDone: boolean;
};

export type ToDoList = {
  title: string;
  id: string;
  items: ToDoItem[];
};
