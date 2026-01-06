import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Link } from "react-router-dom";
import CollapsibleTable from "../../components/UI/material/CollapsibleTable";

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
                </button>
            );
        }

        return pages;
    };

    return (
        <div>
            <div className="tw-flex tw-justify-between tw-items-center">
                <h1 className="tw-text-lg">Tasks</h1>
                <Link
                    to="/tasks/create"
                    className="tw-bg-indigo-400 tw-text-white hover:tw-bg-indigo-300 tw-px-3 tw-py-1 tw-rounded-full tw-shadow-sm"
                >
                    <i className="fa-solid fa-circle-plus tw-mr-1"></i>
                    Create new task
                </Link>
            </div>

            <CollapsibleTable
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
