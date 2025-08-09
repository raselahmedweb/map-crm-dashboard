import {
  useGetAllCustomerQuery,
  useInviteUserMutation,
} from "@/redux/api/baseApi";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import type { IProps } from "./CreateCustomer";
import { X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// eslint-disable-next-line react-refresh/only-export-components
export const Role = [
  "ADMIN",
  "ASSISTANT",
  "SALES_TECHNICIAN",
  "SALES_SPECIALIST",
  "PROJECT_DESIGNER",
  "COLLABORATOR",
  "INSTALLER",
  "TECHNICIAN",
  "CUSTOMER",
];

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  role: string;
}

function InviteUser({ action }: IProps) {
  const form = useForm();

  const [inviteUser, { isError, error }] = useInviteUserMutation();
  if (isError) {
    let errorMessage = "An error occurred";
    if (
      error &&
      typeof error === "object" &&
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
    ) {
      // @ts-expect-error here can have error
      errorMessage = error.data.message;
    } else if (error && "message" in error) {
      // @ts-expect-error here can have error
      errorMessage = error.message;
    }
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const res = await inviteUser(data).unwrap();
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
  };

  const { data } = useGetAllCustomerQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  let customer: ICustomer[] = data?.data?.customer || [];
  customer = customer.filter((c) => c.role === "company");
  return (
    <div className="w-full flex justify-center items-center bg-black/30 h-full fixed inset-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mx-auto shadow-2xl md:w-[500px] bg-gray-50 dark:bg-black rounded-md p-5"
        >
          <button
            type="button"
            className="flex ml-auto cursor-pointer justify-end"
            onClick={action.onClick}
          >
            <X />
          </button>
          <h2 className="text-xl font-bold">Invite User</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E-Mail"
                    {...field}
                    defaultValue={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value || ""}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Role.map((role, idx) => (
                      <SelectItem key={idx} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value || ""}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customer &&
                      customer.map((com, idx) => (
                        <SelectItem key={idx} value={com._id}>
                          {com.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">Send Invitation</Button>
        </form>
      </Form>
    </div>
  );
}

export default InviteUser;
