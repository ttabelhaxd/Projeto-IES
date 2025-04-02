import { useState } from "react";
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

// Schema for validation
const downloadSchema = z
  .object({
    downloadOption: z.enum(["all_data", "interval_data"], {
      required_error: "Please select an option",
    }),
    startDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        "Invalid start date"
      ),
    endDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        "Invalid end date"
      ),
  })
  .refine(
    (data) => {
      if (data.downloadOption === "interval_data") {
        return data.startDate && data.endDate;
      }
      return true;
    },
    {
      message: "Start date and end date are required for interval data",
      path: ["startDate"],
    }
  );

export function DialogDownload({
  onDownload,
}: {
  onDownload: (data: any) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      downloadOption: "all_data",
      startDate: "",
      endDate: "",
    },
  });
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    try {
      onDownload(data); // Pass data back to the parent component
      toast({
        variant: "default",
        title: "Download triggered",
        description: "Your download has started.",
        action: <ToastAction altText="OK">OK</ToastAction>,
        duration: 5000,
      });
      setIsDialogOpen(false); // Close the dialog
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "An error occurred while starting the download.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Download Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Download Options</DialogTitle>
          <DialogDescription>
            Choose to download all data or specify a date range.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              {/* Select Download Option */}
              <FormItem>
                <FormLabel>Download Option</FormLabel>
                <FormControl>
                  <select
                    {...form.register("downloadOption")}
                    className="p-2 border rounded w-full"
                  >
                    <option value="all_data">All Data</option>
                    <option value="interval_data">Interval Data</option>
                  </select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.downloadOption?.message}
                </FormMessage>
              </FormItem>

              {/* Conditional Date Range Inputs */}
              {form.watch("downloadOption") === "interval_data" && (
                <>
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...form.register("startDate")}
                        placeholder="YYYY-MM-DD"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.startDate?.message}
                    </FormMessage>
                  </FormItem>
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...form.register("endDate")}
                        placeholder="YYYY-MM-DD"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.endDate?.message}
                    </FormMessage>
                  </FormItem>
                </>
              )}
            </div>
            <DialogFooter className="mt-5">
              <Button type="submit" variant="default">
                Download
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
