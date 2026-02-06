import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import DefaultLayout from "@/components/DefaultLayout";
import GuestLayout from "@/components/GuestLayout";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/user/Users.jsx";
import UserForm from "@/pages/user/UserForm.jsx";
import Tasks from "@/pages/task/Tasks.jsx";
import TaskForm from "@/pages/task/TaskForm";
import Projects from "@/pages/project/Projects";
import ProjectForm from "@/pages/project/ProjectForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [{ path: "/dashboard", element: <Dashboard /> }],
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            { path: "/users", element: <Users /> },
            { path: "/users/create", element: <UserForm /> },
            { path: "/users/:id", element: <UserForm /> },
        ],
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            { path: "/projects", element: <Projects /> },
            { path: "/projects/create", element: <ProjectForm /> },
            { path: "/projects/:id", element: <ProjectForm /> },
        ],
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            { path: "/tasks", element: <Tasks /> },
            { path: "/tasks/create", element: <TaskForm /> },
            { path: "/tasks/:id", element: <TaskForm /> },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
        ],
    },

    { path: "*", element: <NotFound /> },
]);

export default router;
