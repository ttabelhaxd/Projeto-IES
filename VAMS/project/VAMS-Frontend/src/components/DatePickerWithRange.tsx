"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (range: DateRange | undefined) => void;
  initialRange?: DateRange; 
}

export function DatePickerWithRange({
  className,
  onDateChange,
  initialRange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialRange); 

  const { toast } = useToast();
  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.to && range.to > new Date()) {
      //alert("You can't select a date in the future")
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "You cannot select a date in the future!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
      range.to = new Date();
    }
    setDate(range);
    if (onDateChange) {
      onDateChange(range);
    }
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
