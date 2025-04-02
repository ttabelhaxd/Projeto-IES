import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useVolcanoContext } from "@/utils/VolcanoContext";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const volcanoSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty("Name is required"),
  latitude: z.preprocess(
    (val) => (val === "" ? undefined : parseFloat(val as string)),
    z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
  ),
  longitude: z.preprocess(
    (val) => (val === "" ? undefined : parseFloat(val as string)),
    z
      .number()
      .min(-180, "Longitude must be between -180 e 180")
      .max(180, "Longitude must be between -180 e 180")
  ),
  description: z.string().optional(),
});

export function DialogEditVolcano() {
  const { currVolcano, addNewVolcano, editCurrentVolcano, deleteCurrentVolcano } = useVolcanoContext();
  const [action, setAction] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(volcanoSchema),
    defaultValues: {
      id: "",
      name: "",
      latitude: "",
      longitude: "",
      description: "",
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (action === "edit" && currVolcano) {
      form.reset({
        id: currVolcano.id,
        name: currVolcano.name || "",
        latitude: currVolcano.latitude?.toString() || "",
        longitude: currVolcano.longitude?.toString() || "",
        description: currVolcano.description || "",
      });
    } else if (action === "add") {
      form.reset({
        id: "",
        name: "",
        latitude: "",
        longitude: "",
        description: "",
      });
    }
  }, [action, currVolcano]);

  const handleAddVolcano = async (data: any) => {
    try {
      await addNewVolcano({
        id: "",
        name: data.name.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description.trim(),
      });
      toast({
        variant: "default",
        title: "Success",
        description: "Volcano added successfully",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
      setIsDialogOpen(false); // Close the dialog
    } catch (error: any) {
      console.error("API Error:", error.message);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Volcano could not be added",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
    }
  };

  const handleEditVolcano = async (data: any) => {
    if (!currVolcano) {
      return;
    }
    try {
      await editCurrentVolcano({
        id: data.id,
        name: data.name.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description.trim(),
      });
      toast({
        variant: "default",
        title: "Success",
        description: "Volcano edited successfully",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
      setIsDialogOpen(false); // Close the dialog
    } catch (error: any) {
      console.error("API Error:", error.message);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Volcano could not be edited",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
    }
  };

  const handleDeleteVolcano = async () => {
    if (!currVolcano) {
      return;
    }
    try {
      await deleteCurrentVolcano();
      toast({
        variant: "default",
        title: "Success",
        description: "Volcano deleted successfully",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
      setIsDialogOpen(false); // Close the dialog
    } catch (error: any) {
      console.error("API Error:", error.message);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Volcano could not be deleted",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Volcano Config</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] z-50">
        <DialogHeader>
          <DialogTitle>Volcano Configuration</DialogTitle>
          <DialogDescription>
            Manage your volcano settings here. Choose an option below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex justify-around">
            <Button
              className="w-[8rem]"
              variant={action === "add" ? "default" : "outline"}
              onClick={() => setAction("add")}
            >
              Add
            </Button>
            <Button
              className="w-[8rem]"
              variant={action === "edit" ? "default" : "outline"}
              onClick={() => setAction("edit")}
            >
              Edit
            </Button>
            <Button
              className="w-[8rem]"
              variant={action === "delete" ? "default" : "outline"}
              onClick={() => setAction("delete")}
            >
              Delete
            </Button>
          </div>
          {(action === "add" || action === "edit") && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  action === "add" ? handleAddVolcano : handleEditVolcano
                )}
              >
                <div className="grid grid-cols-1 gap-4">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input id="name" {...form.register("name")} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                  <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          {...form.register("latitude")}
                          disabled={action === "edit"}
                          title={
                            action === "edit"
                              ? "Cannot edit volcano coordinates"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.latitude?.message}
                      </FormMessage>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          {...form.register("longitude")}
                          disabled={action === "edit"}
                          title={
                            action === "edit"
                              ? "Cannot edit volcano coordinates"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.longitude?.message}
                      </FormMessage>
                    </FormItem>
                  </div>
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        id="description"
                        {...form.register("description")}
                        className="p-2 border rounded resize-y w-full"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.description?.message}
                    </FormMessage>
                  </FormItem>
                </div>
                <DialogFooter className="mt-5">
                  {action === "add" && (
                    <Button type="submit" variant="outline">
                      Add New Volcano
                    </Button>
                  )}
                  {action === "edit" && (
                    <Button type="submit" variant="outline">
                      Edit Current Volcano
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          )}
          {action === "delete" && (
            <>
              <div className="text-center">
                <p>To delete the current volcano click the button below:</p>
              </div>
            </>
          )}
        </div>
        {action === "delete" && (
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this volcano?"
                  )
                ) {
                  handleDeleteVolcano();
                }
              }}
            >
              Delete Volcano
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}