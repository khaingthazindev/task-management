import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import {toast} from "react-toastify";

export default function Login() {
    const emailRef = createRef()
    const passwordRef = createRef()
    const {setUser, setToken} = useStateContext()

    const onSubmit = ev => {
        ev.preventDefault()

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        axiosClient.post('/login', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token);
            })
            .catch((err) => {
                if (err.response) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("Network error or server issue");
                }
            });
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <img src="/src/assets/images/illustration.png" alt="" className="tw-w-1/2"/>
            <div
                className="tw-w-1/2 tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-slate-100 tw-to-slate-200">
                <div className="tw-w-full tw-max-w-md tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-8">
                    <form onSubmit={onSubmit} className="tw-space-y-5 tw-font-roboto">
                        <div className="tw-text-center tw-mb-4">
                            <h1 className="tw-text-4xl tw-text-indigo-400 tw-font-arizonia">
                                Task Manager
                            </h1>
                        </div>

                        <input
                            value="knur@gmail.com"
                            ref={emailRef}
                            type="email"
                            placeholder="Email"
                            className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-2 tw-text-sm tw-outline-none
                   focus:tw-border-slate-500 focus:tw-ring-1 focus:tw-ring-slate-400"
                            required
                        />

                        <input
                            value="password"
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                            className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-2 tw-text-sm tw-outline-none
                   focus:tw-border-slate-500 focus:tw-ring-1 focus:tw-ring-slate-400"
                            required
                        />

                        <button
                            type="submit"
                            className="tw-w-full tw-rounded-xl tw-bg-indigo-400 tw-py-2.5 tw-text-white tw-font-medium
                   hover:tw-bg-indigo-300 tw-transition"
                        >
                            Sign in
                        </button>

                        <p className="tw-text-center tw-text-sm tw-text-slate-500">
                            Not registered?{" "}
                            <Link
                                to="/signup"
                                className="tw-font-medium tw-text-indigo-400 hover:tw-underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
