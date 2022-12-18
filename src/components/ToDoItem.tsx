import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import moment from "moment";
import { ToDoItem as ToDoItemType } from "../common/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { todoService } from "../api/todoService";

type ToDoItemProps = {
  todoItem: ToDoItemType;
};

export default function ToDoItem({ todoItem }: ToDoItemProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteItem, isLoading: deleteItemIsLoading } = useMutation({
    mutationFn: todoService.deleteToDoItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
    onError() {
      toast.error("Something went wrong deleting todo item");
    },
  });

  const { mutate: updateComplete, isLoading: updateItemIsLoading } =
    useMutation({
      mutationFn: todoService.updateTodoComplete,
      onSuccess: () => {
        queryClient.invalidateQueries(["todos"]);
      },
      onError() {
        toast.error("Something went wrong updating completes of todo item");
      },
    });

  const isLoading = updateItemIsLoading || deleteItemIsLoading;

  return (
    <li className="flex flex-row items-center py-3">
      <input
        type="checkbox"
        disabled={isLoading}
        onChange={() =>
          updateComplete({ id: todoItem.id, isDone: !todoItem.isDone })
        }
        checked={todoItem.isDone}
        className="checkbox mr-5"
      />
      <div className="grow flex flex-col">
        <p className={`${todoItem.isDone && "line-through"}`}>
          {todoItem.text}
        </p>
        <p className="text-zinc-500 text-sm">
          {moment(todoItem.deadline).calendar({
            sameElse: "DD/MM/YYYY [at] h:mm a",
          })}
        </p>
      </div>
      <button
        disabled={isLoading}
        className="btn"
        onClick={() => deleteItem(todoItem.id)}
      >
        <FaTrashAlt size={20} />
      </button>
    </li>
  );
}
