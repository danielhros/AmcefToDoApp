import { NewToDoItem, ToDoItem, ToDoList } from "../common/types";
import request from "./request";

export const todoService = {
  // Lists
  async getAllToDoLists(): Promise<ToDoList[]> {
    return await request({ url: `/lists`, method: "GET" });
  },

  async createToDoList(title: string): Promise<ToDoList> {
    return await request({ url: `/lists`, method: "POST", data: { title } });
  },

  async deleteToDoList(todoListId: string): Promise<void> {
    return await request({ url: `/lists/${todoListId}`, method: "DELETE" });
  },

  // Item In Lists
  async getAllToDos(todoListId: string): Promise<ToDoList> {
    return await request({ url: `/lists/${todoListId}`, method: "GET" });
  },

  async deleteToDoItem({
    id,
    todoListId,
  }: {
    id: string;
    todoListId: string;
  }): Promise<ToDoItem> {
    return await request({
      url: `/lists/${todoListId}/items/${id}`,
      method: "DELETE",
    });
  },

  async updateToDoComplete({
    id,
    isDone,
    todoListId,
  }: {
    id: string;
    isDone: boolean;
    todoListId: string;
  }) {
    return await request({
      url: `/lists/${todoListId}/items/${id}`,
      method: "PUT",
      data: { isDone },
    });
  },

  async createToDoItem({
    newToDoItem,
    todoListId,
  }: {
    newToDoItem: NewToDoItem;
    todoListId: string;
  }): Promise<ToDoItem> {
    return await request({
      url: `/lists/${todoListId}/items`,
      method: "POST",
      data: newToDoItem,
    });
  },
};
