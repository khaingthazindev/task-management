import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Link } from "react-router-dom";
import UserCollapsibleTable from "@/pages/user/UserCollapsibleTable";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });

    useEffect(() => {
        getUsers(pagination.current_page);
    }, []);

    const getUsers = (page = 1) => {
        setLoading(true);
        let url = `/users?page=${page}`;

        axiosClient
            .get(url)
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

    const onDeleteClick = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        axiosClient.delete(`/users/${id}`).then(() => {
            getUsers(pagination.current_page);
        });
    };

    const renderPageNumbers = () => {
        const pages = [];
        const { current_page, last_page } = pagination;

        const delta = 1; // how many pages around current
        const range = [];

        for (
            let i = Math.max(2, current_page - delta);
            i <= Math.min(last_page - 1, current_page + delta);
            i++
        ) {
            range.push(i);
        }

        if (current_page - delta > 2) {
            range.unshift("...");
        }

        if (current_page + delta < last_page - 1) {
            range.push("...");
        }

        range.unshift(1);
        if (last_page > 1) range.push(last_page);

        range.forEach((page, index) => {
            if (page === "...") {
                pages.push(
                    <span key={`dots-${index}`} className="tw-px-3">
                        ...
                    </span>,
                );
            } else {
                pages.push(
                    <button
                        key={page}
                        onClick={() => getUsers(page)}
                        className={`tw-px-3 tw-py-1 tw-border tw-rounded
                  ${
                      current_page === page
                          ? "tw-bg-indigo-400 tw-text-white"
                          : "hover:tw-bg-gray-100"
                  }
                `}
                    >
                        {page}
                    </button>,
                );
            }
        });

        return pages;
    };

    return (
        <div>
            <div className="tw-flex tw-justify-between tw-items-center">
                <h1 className="tw-text-lg">Users</h1>

                <div className="tw-flex tw-justify-between tw-items-center ">
                    <Link
                        to="/users/create"
                        className="tw-ml-5 tw-bg-indigo-400 tw-text-white hover:tw-bg-indigo-300 tw-px-3 tw-py-1 tw-rounded-full tw-shadow-sm tw-inline"
                    >
                        <i className="fa-solid fa-circle-plus tw-mr-1"></i>
                        Create new user
                    </Link>
                </div>
            </div>

            <UserCollapsibleTable
                users={users}
                onDeleteClick={onDeleteClick}
                loading={loading}
                pagination={pagination}
                renderPageNumbers={renderPageNumbers}
                getUsers={getUsers}
            />
        </div>
    );
}
