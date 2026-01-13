import { Bounce, toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { useGetMeQuery, useLoginUserMutation } from "@/redux/api/baseApi";

function Login() {
  const navigate = useNavigate();
  const form = useForm();
  const [userLogin] = useLoginUserMutation();
  const { data, isLoading } = useGetMeQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  if (isLoading) {
    // You can customize this: loader spinner, skeleton, etc.
    return <div>Loading...</div>;
  }

  const isAuthenticated = data?.data?.role === "ADMIN";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const credentials = data;
    const res = await userLogin(credentials).unwrap();
    console.log(res);
    toast.success(res.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });
    form.reset();
    navigate("/");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md mx-auto my-10"
      >
        <h2 className="text-xl font-bold">Login</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  defaultValue={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  {...field}
                  defaultValue={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
      <span className="text-center text-sm text-gray-500">
        admin / Admin123@
      </span>
    </Form>
  );
}

export default Login;
