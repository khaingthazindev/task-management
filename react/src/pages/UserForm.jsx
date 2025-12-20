import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {toast} from "react-toastify";

export default function UserForm() {
    const navigate = useNavigate();
    const { id } = useParams();


    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        axiosClient
            .get(`/users/${id}`)
            .then(({ data }) => {
                console.log('data', `/users/${id}`);
                setUser(data)
            })
            .finally(() => setLoading(false));
    }, [id]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (user.id) {
                await axiosClient.put(`/users/${user.id}`, user);
                toast.success("User was successfully updated");
            } else {
                await axiosClient.post("/users", user);
                toast.success("User was successfully created");
            }
            navigate("/users");
        } catch (err) {
            if (err.response?.status === 422) {
                toast.error(err.response.data.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="tw-max-w-2xl tw-mx-auto">
            <h1 className="tw-text-xl tw-font-semibold tw-mb-4">
                {user.id ? `Update User` : "Create New User"}
            </h1>

            <div className="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-p-6">
                {loading && (
                    <div className="tw-text-center tw-text-gray-500">Loading...</div>
                )}

                {!loading && (
                    <form onSubmit={onSubmit} className="tw-space-y-4">
                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Name
                            </label>
                            <input
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                className="tw-w-full tw-rounded-lg tw-border tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-400"
                                placeholder="Enter name"
                                required
                            />
                        </div>

                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                className="tw-w-full tw-rounded-lg tw-border tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-400"
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                className="tw-w-full tw-rounded-lg tw-border tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-400"
                                placeholder="********"
                            />
                        </div>

                        <div>
                            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={user.password_confirmation}
                                onChange={handleChange}
                                className="tw-w-full tw-rounded-lg tw-border tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-400"
                                placeholder="********"
                            />
                        </div>

                        <div className="tw-flex tw-justify-end tw-gap-2 tw-pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/users")}
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
