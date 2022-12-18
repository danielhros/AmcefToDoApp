import { NewToDoItem, ToDoItem } from "../common/types";
import request from "./request";

export const todoService = {
  async getAllToDos(): Promise<ToDoItem[]> {
    return await request({ url: "/todo_items", method: "GET" });
  },
  async deleteToDoItem(id: string): Promise<ToDoItem> {
    return await request({ url: `/todo_items/${id}`, method: "DELETE" });
  },

  async updateTodoComplete({ id, isDone }: { id: string; isDone: boolean }) {
    return await request({
      url: `/todo_items/${id}`,
      method: "PUT",
      data: { isDone },
    });
  },

  async createToDoItem(newTodoItem: NewToDoItem): Promise<ToDoItem> {
    return await request({
      url: "/todo_items/",
      method: "POST",
      data: newTodoItem,
    });
  },
};
