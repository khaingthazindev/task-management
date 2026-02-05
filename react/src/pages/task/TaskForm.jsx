import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { toast } from "react-toastify";
import CustomDatePicker from "@/components/UI/CustomDatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export default function TaskForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const padZero = (para) => {
        return String(para).padStart(2, "0");
    };

    let today = new Date();
    let formatTodayDate =
        today.getFullYear() +
        "-" +
        padZero(today.getMonth() + 1) +
        "-" +
        padZero(today.getDate()) +
        " " +
        padZero(today.getHours()) +
        ":" +
        padZero(today.getMinutes()) +
        ":" +
        padZero(today.getSeconds());

    const [task, setTask] = useState({
        id: null,
        title: "",
        description: "",
        status: "to-do",
        due_date: formatTodayDate,
        priority: "low",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        axiosClient
            .get(`/tasks/${id}`)
            .then(({ data }) => {
                let oldTask = data.data;
                setTask({
                    id: oldTask.id,
                    title: oldTask.title,
                    description:
                        oldTask.description === null
                            ? undefined
                            : oldTask.description,
                    status: oldTask.status,
                    due_date: oldTask.due_date,
                    priority: oldTask.priority,
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (task.id) {
                await axiosClient.put(`/tasks/${task.id}`, task);
                toast.success("Task was successfully updated");
            } else {
                await axiosClient.post("/tasks", task);
                toast.success("Task was successfully created");
            }
            navigate("/tasks");
        } catch (err) {
            if (err.response?.status === 422) {
                toast.error(err.response.data.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const changeDueDate = (date) => {
        let selectedDate = new Date(date);
        let formatDate =
            selectedDate.getFullYear() +
            "-" +
            padZero(selectedDate.getMonth() + 1) +
            "-" +
            padZero(selectedDate.getDate()) +
            " " +
            padZero(selectedDate.getHours()) +
            ":" +
            padZero(selectedDate.getMinutes()) +
            ":" +
            padZero(selectedDate.getSeconds());

        setTask({ ...task, ["due_date"]: formatDate });
    };

    return (
        <div className="tw-max-w-2xl tw-mx-auto">
            <h1 className="tw-text-xl tw-font-semibold tw-mb-4">
                {id ? `Update Task` : "Create New Task"}
            </h1>

            <div className="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-p-6">
                {loading && (
                    <div className="tw-text-center tw-text-gray-500">
                        <img
                            src="/src/assets/images/loading.gif"
                            alt=""
                            className="tw-inline-block tw-w-7"
                        />
                    </div>
                )}

                {!loading && (
                    <form onSubmit={onSubmit} className="tw-space-y-4">
                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Title
                            </label>
                            <input
                                name="title"
                                value={task.title}
                                onChange={handleChange}
                                className="tw-w-full tw-rounded-lg tw-border tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-400"
                                placeholder="Enter title"
                                required
                            />
                        </div>

                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                onChange={handleChange}
                                className="tw-border tw-w-full tw-rounded-lg tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-400"
                                placeholder="Enter Description"
                                value={task.description}
                            ></textarea>
                        </div>

                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Status
                            </label>
                            <div className="tw-flex">
                                <FormControlLabel
                                    control={<Radio />}
                                    label="To-do"
                                    name="status"
                                    value="to-do"
                                    onChange={handleChange}
                                    checked={task.status === "to-do"}
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    label="In-progress"
                                    name="status"
                                    value="in-progress"
                                    onChange={handleChange}
                                    checked={task.status === "in-progress"}
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    label="Done"
                                    name="status"
                                    value="done"
                                    onChange={handleChange}
                                    checked={task.status === "done"}
                                />
                            </div>
                        </div>

                        <div className="tw-w-full">
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Due Date
                            </label>
                            <CustomDatePicker
                                changeDueDate={changeDueDate}
                                customStyle={`tw-w-full tw-rounded-lg tw-border tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-400`}
                            />
                        </div>

                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Priority
                            </label>
                            <div className="tw-flex">
                                <FormControlLabel
                                    control={<Radio />}
                                    label="Low"
                                    name="priority"
                                    value="low"
                                    onChange={handleChange}
                                    checked={task.priority === "low"}
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    label="Medium"
                                    name="priority"
                                    value="medium"
                                    onChange={handleChange}
                                    checked={task.priority === "medium"}
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    label="High"
                                    name="priority"
                                    value="high"
                                    onChange={handleChange}
                                    checked={task.priority === "high"}
                                />
                            </div>
                        </div>

                        <div className="tw-flex tw-justify-end tw-gap-2 tw-pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/tasks")}
                                className="tw-rounded-lg tw-border tw-w-20 tw-py-2 hover:tw-bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="tw-rounded-lg tw-bg-indigo-400 tw-w-20 tw-py-2 tw-text-white hover:tw-bg-indigo-400"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
