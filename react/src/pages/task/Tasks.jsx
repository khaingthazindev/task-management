import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Link } from "react-router-dom";
import TaskCollapsibleTable from "@/pages/task/TaskCollapsibleTable";
import TextField from "@mui/material/TextField";
import MultipleSelectCheckmarks from "@/components/UI/material/MultipleSelectCheckmarks";

export default function Tasks() {
    const statuses = ["to-do", "in-progress", "done"];
    const priorities = ["low", "medium", "high"];
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [filter, setFilter] = useState({
        search: "",
        status: [],
        priority: "",
    });

    useEffect(() => {
        getTasks(pagination.current_page);
    }, [filter]);

    const getTasks = (page = 1) => {
        setLoading(true);
        let url = `/tasks?page=${page}`;
        if (filter.search || filter.status || filter.priority) {
            url += `&search=${filter.search}&status=${filter.status}&priority=${filter.priority}&order_by_id=-1`;
        }
        axiosClient
            .get(url)
            .then(({ data }) => {
                setTasks(data.data || []);
                setPagination(data.meta);
                setLoading(false);
            })
            .catch(() => {
                setTasks([]);
                setLoading(false);
            });
    };

    const onDeleteClick = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        axiosClient.delete(`/tasks/${id}`).then(() => {
            getTasks(pagination.current_page);
        });
    };

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => getTasks(i)}
                    className={`tw-px-3 tw-py-1 tw-border tw-rounded
          ${
              pagination.current_page === i
                  ? "tw-bg-indigo-400 tw-text-white"
                  : "hover:tw-bg-gray-100"
          }
        `}
                >
                    {i}
                </button>,
            );
        }

        return pages;
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            getTasks();
        }
    };

    const searchHandler = (e) => {
        setFilter({
            ...filter,
            ["search"]: e.target.value,
        });
    };

    const selectHandler = (e) => {
        if (e.target.name === "status") {
            setFilter({
                ...filter,
                ["status"]: e.target.value,
            });
        }
        if (e.target.name === "priority") {
            setFilter({
                ...filter,
                ["priority"]: e.target.value,
            });
        }
    };

    return (
        <div>
            <div className="tw-flex tw-justify-between tw-items-center">
                <h1 className="tw-text-lg">Tasks</h1>

                <div className="tw-flex tw-justify-between tw-items-center ">
                    <TextField
                        name="search"
                        id="outlined-basic"
                        label="Search Field"
                        variant="outlined"
                        size="small"
                        value={filter.search}
                        onChange={searchHandler}
                        onKeyDown={handleKeyDown}
                    />
                    <MultipleSelectCheckmarks
                        items={statuses}
                        label={"Status"}
                        name={"status"}
                        selectHandler={selectHandler}
                    />
                    <MultipleSelectCheckmarks
                        items={priorities}
                        label={"Priority"}
                        name={"priority"}
                        selectHandler={selectHandler}
                    />
                    <Link
                        to="/tasks/create"
                        className="tw-ml-5 tw-bg-indigo-400 tw-text-white hover:tw-bg-indigo-300 tw-px-3 tw-py-1 tw-rounded-full tw-shadow-sm tw-inline"
                    >
                        <i className="fa-solid fa-circle-plus tw-mr-1"></i>
                        Create new task
                    </Link>
                </div>
            </div>

            <TaskCollapsibleTable
                tasks={tasks}
                onDeleteClick={onDeleteClick}
                loading={loading}
                pagination={pagination}
                renderPageNumbers={renderPageNumbers}
                getTasks={getTasks}
            />
        </div>
    );
}
