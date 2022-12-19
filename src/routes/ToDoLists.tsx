import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { todoService } from "../api/todoService";
import { ToDoList } from "../common/types";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title is too short")
    .max(20, "Title is too long")
    .required("Title field is empty"),
});

export default function TodoLists() {
  const [todoLists, setTodoList] = useState<ToDoList[]>([]);

  const { isFetching: todoListsLoading } = useQuery({
    queryKey: ["todoLists"],
    queryFn: todoService.getAllToDoLists,
    onSuccess(data) {
      setTodoList(data);
    },
    onError() {
      toast.error("Something went wrong getting all todo lists");
    },
  });

  const { mutate: createList, isLoading: createListIsLoading } = useMutation({
    mutationFn: todoService.createToDoList,
    onSuccess: (newTodoList) => {
      setTodoList([...todoLists, newTodoList]);
    },
    onError() {
      toast.error("Something went wrong creating new list");
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema,
    onSubmit: (formValues, { resetForm }) => {
      createList(formValues.title);
      resetForm();
    },
  });

  return (
    <>
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-8">My ToDo App</h1>
            {/* Loading */}
            {todoListsLoading && <p className="text-center">Loading..</p>}
            {/* Showing data */}
            {!todoListsLoading &&
              (todoLists.length === 0 ? (
                <p>No lists..</p>
              ) : (
                todoLists.map((todoList) => (
                  <div key={todoList.id}>
                    <Link to={`/list/${todoList.id}`}>
                      <button className="btn mb-2">{todoList.title}</button>
                    </Link>
                    <br />
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>

      <div className="toast">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-row items-end">
            <div className="flex flex-col">
              {formik.touched.title && formik.errors.title && (
                <span className="text-red-400">{formik.errors.title}</span>
              )}
              <input
                className={`input input-bordered w-full mt-1 ${
                  formik.touched.title &&
                  formik.errors.title &&
                  "border-red-400"
                }`}
                disabled={createListIsLoading}
                id="title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.title}
                placeholder="Add new list"
              />
            </div>
            <button
              disabled={createListIsLoading}
              type="submit"
              className="btn btn-ghost ml-2"
            >
              <AiOutlinePlusCircle size={40} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
