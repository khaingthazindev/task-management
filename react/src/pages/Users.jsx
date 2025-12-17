import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();

    useEffect(() => {
        getUsers();
    }, []);

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        axiosClient.delete(`/users/${user.id}`).then(() => {
            setNotification("User was successfully deleted");
            getUsers();
        });
    };

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get("/users")
            .then(({data}) => {
                setLoading(false);
                if (Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    setUsers([]);
                }
            })
            .catch(() => {
                setLoading(false);
                setUsers([]);
            });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1 className="tw-text-lg">Users</h1>
                <button className="btn btn-sm tw-bg-green-400 hover:tw-bg-green-300 tw-px-3 tw-py-1 tw-rounded-full tw-shadow-sm">
                    <Link to="/users/new">
                        <i className="fa-solid fa-circle-plus tw-mr-1"></i>
                        <span>Create new user</span>
                    </Link>
                </button>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Create Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    {loading && (
                        <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">
                                Loading...
                            </td>
                        </tr>
                        </tbody>
                    )}
                    {!loading && Array.isArray(users) && (
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.created_at}</td>
                                <td>
                                    <Link className="btn-edit" to={"/users/" + u.id}>
                                        <i className="fa-regular fa-pen-to-square tw-text-lg tw-text-orange-400"></i>
                                    </Link>
                                    <button
                                        onClick={() => onDeleteClick(u)}
                                    >
                                        <i className="fa-regular fa-trash-can tw-text-lg tw-text-red-400"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    )}
                    {!loading && !Array.isArray(users) && (
                        <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">
                                No users found.
                            </td>
                        </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
