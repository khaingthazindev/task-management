import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "@/context/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });

    const { setNotification } = useStateContext();

    useEffect(() => {
        getUsers(pagination.current_page);
    }, [pagination.current_page]);

    const getUsers = (page = 1) => {
        setLoading(true);
        axiosClient
            .get(`/users?page=${page}`)
            .then(({ data }) => {
                setUsers(data.data || []);
                setPagination(data.meta);
                setLoading(false);
            })
            .catch(() => {
                setUsers([]);
                setLoading(false);
            });
    };

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        axiosClient.delete(`/users/${user.id}`).then(() => {
            setNotification("User was successfully deleted");
            getUsers(pagination.current_page);
        });
    };

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => getUsers(i)}
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
                <h1 className="tw-text-lg">Users</h1>
                <Link
                    to="/users/create"
                    className="tw-bg-indigo-400 tw-text-white hover:tw-bg-indigo-300 tw-px-3 tw-py-1 tw-rounded-full tw-shadow-sm"
                >
                    <i className="fa-solid fa-circle-plus tw-mr-1"></i>
                    Create new user
                </Link>
            </div>

            <div className="card animated fadeInDown">
                <div className="tw-w-full">
                    <table className="tw-border-collapse">
                        <thead>
                            <tr className="tw-border-b">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Create Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="tw-text-center">
                                        <img
                                            src="/src/assets/images/loading.gif"
                                            alt=""
                                            className="tw-inline-block tw-w-7"
                                        />
                                    </td>
                                </tr>
                            )}

                            {!loading && users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="tw-text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                users.map((u) => (
                                    <tr key={u.id} className="tw-border-b">
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.created_at}</td>
                                        <td className="tw-space-x-2">
                                            <Link to={`/users/${u.id}`}>
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
                        onClick={() => getUsers(pagination.current_page - 1)}
                        className="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>

                    {renderPageNumbers()}

                    <button
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                        onClick={() => getUsers(pagination.current_page + 1)}
                        className="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50"
                    >
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
