import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Link } from "react-router-dom";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    console.log(pagination);

    useEffect(() => {
        getTasks(pagination.current_page);
    }, []);

    const getTasks = (page = 1) => {
        setLoading(true);
        axiosClient
            .get(`/tasks?page=${page}`)
            .then(({ data }) => {
                console.log(data);

                setTasks(data.data || []);
                setPagination(data.meta);
                setLoading(false);
            })
            .catch(() => {
                setTasks([]);
                setLoading(false);
            });
    };

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        axiosClient.delete(`/tasks/${user.id}`).then(() => {
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
                </button>
            );
        }

        return pages;
    };

    return (
        <div>
            <div className="tw-flex tw-justify-between tw-items-center">
                <h1 className="tw-text-lg">tasks</h1>
                <Link
                    to="/tasks/create"
                    className="tw-bg-indigo-400 tw-text-white hover:tw-bg-indigo-300 tw-px-3 tw-py-1 tw-rounded-full tw-shadow-sm"
                >
                    <i className="fa-solid fa-circle-plus tw-mr-1"></i>
                    Create new task
                </Link>
            </div>

            <div className="card animated fadeInDown">
                <div className="tw-w-full">
                    <table className="tw-border-collapse">
                        <thead>
                            <tr className="tw-border-b">
                                <th>ID</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th>Create Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="7" className="tw-text-center">
                                        <img
                                            src="/src/assets/images/loading.gif"
                                            alt=""
                                            className="tw-inline-block tw-w-7"
                                        />
                                    </td>
                                </tr>
                            )}

                            {!loading && tasks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="tw-text-center">
                                        No tasks found
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                tasks.map((u) => (
                                    <tr key={u.id} className="tw-border-b">
                                        <td>{u.id}</td>
                                        <td>{u.title}</td>
                                        <td>{u.status}</td>
                                        <td>{u.priority}</td>
                                        <td>{u.due_date ?? "-"}</td>
                                        <td>{u.created_at}</td>
                                        <td className="tw-space-x-2">
                                            <Link to={`/tasks/${u.id}`}>
                                                <i className="fa-regular fa-pen-to-square tw-text-orange-400"></i>
                                            </Link>
                                            <button
                                                onClick={() => onDeleteClick(u)}
                                            >
                                                <i className="fa-regular fa-trash-can tw-text-red-400"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className="tw-flex tw-justify-end tw-items-center tw-gap-1 tw-mt-4">
                    <button
                        disabled={pagination.current_page === 1}
                        onClick={() => getTasks(pagination.current_page - 1)}
                        className="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>

                    {renderPageNumbers()}

                    <button
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                        onClick={() => getTasks(pagination.current_page + 1)}
                        className="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50"
                    >
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
