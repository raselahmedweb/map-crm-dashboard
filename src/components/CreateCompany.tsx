import { Bounce, toast } from "react-toastify";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateCompanyMutation } from "@/redux/api/baseApi";
import { X } from "lucide-react";

export interface IProps {
  action: {
    onClick: () => void;
  };
}

function CreateCompany({ action }: IProps) {
  const form = useForm();

  const [createCompany, { isError, error }] = useCreateCompanyMutation();
  if (isError) {
    console.log(error);
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const res = await createCompany(data).unwrap();
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
          <h2 className="text-xl font-bold">Create Company</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    defaultValue={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-sm font-thin">(optional)</span>
                </FormLabel>
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
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Website <span className="text-sm font-thin">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Website"
                    {...field}
                    defaultValue={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Logo <span className="text-sm font-thin">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Logo"
                    {...field}
                    defaultValue={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Create company</Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateCompany;
