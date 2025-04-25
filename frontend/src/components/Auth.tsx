import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
type FormData = {
  email: string;
  username: string;
  password: string;
};

export default function AuthForm() {
  const { login, logout, register, user } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        if (res.data.authenticated) {
          navigate("/"); // Redirect về trang chủ nếu đã đăng nhập
        }
      } catch (error) {
        console.log("Not authenticated", error);

      } finally {
        // setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const onSubmit = async (data: FormData) => {
    console.log("in submit");

    try {
      if (isLogin) {
        const user = await login({ email: data.email, password: data.password });

        if (user.role == "seller") {
          navigate("/admin"); // Redirect to dashboard
        } else {
          // user
          navigate("/"); // Redirect to dashboard
        }
      } else {
        console.log("register", JSON.stringify(data));
  
        const user = await register(data.email, data.username, data.password);
  
        if (user) {
          toast.success("Register successful");
          navigate("/"); // Redirect to dashboard
        }
      }
      reset();
    } catch(error) {
      toast.error("Incredentails not valid")
      return
    }
  };

  // if (user) return <button onClick={logout}>Logout</button>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md mt-60">
      <h2 className="text-xl font-bold">{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...formRegister("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {!isLogin && (
          <div>
            <input
              {...formRegister("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
        )}

        <div>
          <input
            {...formRegister("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500"
      >
        {isLogin ? "Switch to Register" : "Switch to Login"}
      </button>
    </div>
  );
}
