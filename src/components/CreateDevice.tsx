import { Bounce, toast } from "react-toastify";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateDeviceMutation } from "@/redux/api/baseApi";
import { X } from "lucide-react";

export interface IProps {
  action: {
    onClick: () => void;
  };
}

function CreateDevice({ action }: IProps) {
  const form = useForm();

  const [createDevice, { isError, error }] = useCreateDeviceMutation();
  if (isError) {
    console.log(error);
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      copies: Number(data.copies),
    };

    const res = await createDevice(formattedData).unwrap();
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
    <div className="w-full flex justify-center items-center bg-black/30 fixed inset-0">
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
          <h2 className="text-xl font-bold">Create Device</h2>
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Label"
                    {...field}
                    defaultValue={field.value || ""}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shape"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shape</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Shape"
                    {...field}
                    defaultValue={field.value || ""}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    {...field}
                    defaultValue={field.value || ""}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="copies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copies</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="copies"
                    {...field}
                    defaultValue={field.value || ""}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Create Device</Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateDevice;
