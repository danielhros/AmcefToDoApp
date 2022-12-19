import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../api/todoService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title is too short")
    .max(30, "Title is too long, max 30 characters")
    .required("Title field is required"),
  text: Yup.string()
    .min(2, "Text is too short")
    .required("Text field is required"),
  deadline: Yup.date()
    .typeError("${value}")
    .required("Deadline field is required"),
});

export default function CreateToDoItem() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createItem, isLoading } = useMutation({
    mutationFn: todoService.createToDoItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      navigate("/");
    },
    onError() {
      toast.error("Something went wrong creating new todo item");
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
      deadline: "",
    },
    validationSchema,
    onSubmit: (formValues) => {
      createItem({ ...formValues, isDone: false });
    },
  });
  return (
    <div className="card bg-neutral text-primary-content">
      <div className="card-body">
        <h2 className="card-title">Add new item</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Title*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              autoFocus
              onChange={formik.handleChange}
              value={formik.values.title}
              placeholder="Title"
              className={`input input-bordered w-full mb-2 ${
                formik.touched.title && formik.errors.title && "border-red-400"
              }`}
            />
            {formik.touched.title && formik.errors.title && (
              <span className="text-red-400">{formik.errors.title}</span>
            )}
            <label className="label">
              <span className="label-text">Text*</span>
            </label>
            <input
              id="text"
              name="text"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.text}
              placeholder="Text"
              className={`input input-bordered w-full mb-2 ${
                formik.touched.text && formik.errors.text && "border-red-400"
              }`}
            />
            {formik.touched.text && formik.errors.text && (
              <span className="text-red-400">{formik.errors.text}</span>
            )}
            <label className="label">
              <span className="label-text">Deadline*</span>
            </label>
            <input
              id="deadline"
              type="datetime-local"
              name="deadline"
              onChange={formik.handleChange}
              value={formik.values.deadline}
              className={`input input-bordered w-full mb-2 ${
                formik.touched.deadline &&
                formik.errors.deadline &&
                "border-red-400"
              }`}
            />
            {formik.touched.deadline && formik.errors.deadline && (
              <span className="text-red-400">{formik.errors.deadline}</span>
            )}
          </div>
          <div className="card-actions flex flex-col justify-end md:flex-row md:flex-grow mt-4">
            <Link className="w-full md:w-36" to="/">
              <button disabled={isLoading} className="btn w-full ">
                Cancel
              </button>
            </Link>
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-primary w-full md:w-36"
            >
              Add new
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
