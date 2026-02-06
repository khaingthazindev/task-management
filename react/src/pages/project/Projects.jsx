import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Link } from "react-router-dom";
import ProjectCollapsibleTable from "@/pages/project/ProjectCollapsibleTable";
import TextField from "@mui/material/TextField";

export default function Projects() {
    const [projects, setprojects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [filter, setFilter] = useState({
        search: "",
        status: [],
    });

    useEffect(() => {
        getProjects(pagination.current_page);
    }, [filter]);

    const getProjects = (page = 1) => {
        setLoading(true);
        let url = `/projects?page=${page}`;
        if (filter.search || filter.status) {
            url += `&search=${filter.search}&order_by_id=-1`;
        }
        axiosClient
            .get(url)
            .then(({ data }) => {
                setprojects(data.data || []);
                setPagination(data.meta);
                setLoading(false);
            })
            .catch(() => {
                setprojects([]);
                setLoading(false);
            });
    };

    const onDeleteClick = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        axiosClient.delete(`/projects/${id}`).then(() => {
            getProjects(pagination.current_page);
        });
    };

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => getProjects(i)}
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
            getProjects();
        }
    };

    const searchHandler = (e) => {
        setFilter({
            ...filter,
            ["search"]: e.target.value,
        });
    };

    return (
        <div>
            <div className="tw-flex tw-justify-between tw-items-center">
                <h1 className="tw-text-lg">Projects</h1>

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
                    <Link
                        to="/projects/create"
                        className="tw-ml-5 tw-bg-indigo-400 tw-text-white hover:tw-bg-indigo-300 tw-px-3 tw-py-1 tw-rounded-full tw-shadow-sm tw-inline"
                    >
                        <i className="fa-solid fa-circle-plus tw-mr-1"></i>
                        Create new project
                    </Link>
                </div>
            </div>

            <ProjectCollapsibleTable
                projects={projects}
                onDeleteClick={onDeleteClick}
                loading={loading}
                pagination={pagination}
                renderPageNumbers={renderPageNumbers}
                getProjects={getProjects}
            />
        </div>
    );
}
