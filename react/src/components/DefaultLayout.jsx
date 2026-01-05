import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle

    useEffect(() => {
        axiosClient
            .get("/user")
            .then(({ data }) => setUser(data))
            .catch((error) =>
                console.error("Failed to fetch user data:", error)
            );
    }, [setUser]);

    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

    if (!token) return <Navigate to="/login" />;

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    const breadcrumbs = location.pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, array) => {
            const path = "/" + array.slice(0, index + 1).join("/");

            // Human readable labels
            const labelMap = {
                dashboard: "Dashboard",
                users: "Users",
                new: "New",
            };

            const label =
                labelMap[segment] ||
                (isNaN(segment)
                    ? segment.charAt(0).toUpperCase() + segment.slice(1)
                    : "Edit");

            return { label, path };
        });

    return (
        <div className="tw-flex tw-h-screen tw-font-roboto tw-text-slate-700">
            <aside
                className={`tw-bg-gradient-to-br tw-from-sky-200 tw-to-indigo-50 tw-shadow-sm tw-flex tw-flex-col tw-p-6 tw-transition-all tw-duration-300 ${
                    sidebarOpen ? "tw-w-64" : "tw-w-25"
                }`}
            >
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
                    <div className="tw-flex tw-items-center">
                        {!sidebarOpen && (
                            <img
                                src="/src/assets/images/checklist.png"
                                alt=""
                                className="tw-w-10 tw-mr-2"
                            />
                        )}

                        {sidebarOpen && (
                            <h1 className="tw-font-bold tw-font-arizonia tw-text-3xl tw-text-indigo-400">
                                Task Manager
                            </h1>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="tw-text-gray-600 hover:tw-text-gray-900 tw-transition"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>

                <nav className="tw-flex-1 tw-flex tw-flex-col tw-gap-1">
                    <Link
                        to="/dashboard"
                        className={`tw-py-2 tw-px-4 tw-rounded hover:tw-bg-indigo-100 tw-transition menu-item ${
                            isActive("/dashboard") ? "active" : ""
                        }`}
                    >
                        {sidebarOpen ? (
                            "Dashboard"
                        ) : (
                            <span className="tw-text-xl">🏠</span>
                        )}
                    </Link>
                    <Link
                        to="/users"
                        className={`tw-py-2 tw-px-4 tw-rounded hover:tw-bg-indigo-100 tw-transition menu-item ${
                            isActive("/users") ? "active" : ""
                        }`}
                    >
                        {sidebarOpen ? (
                            "Users"
                        ) : (
                            <span className="tw-text-xl">👥</span>
                        )}
                    </Link>
                    <Link
                        to="/tasks"
                        className={`tw-py-2 tw-px-4 tw-rounded hover:tw-bg-indigo-100 tw-transition menu-item ${
                            isActive("/tasks") ? "active" : ""
                        }`}
                    >
                        {sidebarOpen ? (
                            "Tasks"
                        ) : (
                            <span className="tw-text-xl">☑️</span>
                        )}
                    </Link>
                </nav>
            </aside>

            <div className="tw-flex-1 tw-flex tw-flex-col">
                <header className="tw-bg-white tw-shadow-sm tw-flex tw-justify-between tw-items-center tw-px-6 tw-h-16">
                    <nav className="tw-flex tw-items-center tw-gap-2 tw-text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <span
                                key={crumb.path}
                                className="tw-flex tw-items-center tw-gap-2"
                            >
                                {index !== breadcrumbs.length - 1 ? (
                                    <Link
                                        to={crumb.path}
                                        className="tw-text-indigo-500 hover:tw-underline"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="tw-text-gray-600 tw-font-medium">
                                        {crumb.label}
                                    </span>
                                )}

                                {index < breadcrumbs.length - 1 && (
                                    <span className="tw-text-gray-400">/</span>
                                )}
                            </span>
                        ))}
                    </nav>

                    <div className="tw-flex tw-items-center tw-gap-4">
                        <span className="tw-uppercase">{user.name}</span>
                        <button onClick={onLogout} className="tw-w-20">
                            <img
                                src="/src/assets/images/switch.png"
                                alt=""
                                className="tw-w-1/3 tw-rounded-full"
                            />
                        </button>
                    </div>
                </header>

                <main className="tw-relative tw-flex-1 tw-p-6 tw-overflow-auto tw-bg-[url('/src/assets/images/content_background.jpg')] tw-bg-cover">
                    <div className="tw-relative tw-z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
