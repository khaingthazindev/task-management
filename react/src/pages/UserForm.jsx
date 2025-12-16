import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { setNotification } = useStateContext();

    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch user data if editing
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        axiosClient
            .get(`/users/${id}`)
            .then(({ data }) => setUser(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    // Handle form submission
    const onSubmit = async (ev) => {
        ev.preventDefault();
        setErrors({});

        try {
            if (user.id) {
                await axiosClient.put(`/users/${user.id}`, user);
                setNotification("User was successfully updated");
            } else {
                await axiosClient.post("/users", user);
                setNotification("User was successfully created");
            }
            navigate("/users");
        } catch (err) {
            const response = err.response;
            if (response?.status === 422) {
                setErrors(response.data.errors);
            }
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <h1>{user.id ? `Update User: ${user.name}` : "New User"}</h1>

            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}

                {Object.keys(errors).length > 0 && (
                    <div className="alert">
                        {Object.entries(errors).map(([key, value]) => (
                            <p key={key}>{value[0]}</p>
                        ))}
                    </div>
                )}

                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            placeholder="Name"
                        />
                        <input
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            name="password_confirmation"
                            value={user.password_confirmation}
                            onChange={handleChange}
                            placeholder="Password Confirmation"
                        />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    );
}
