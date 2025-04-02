import { DateRange as DayPickerDateRange } from "react-day-picker";

interface ViewingDataProps {

    dateRange: DayPickerDateRange | undefined;

}
export function ViewingData({ dateRange }: ViewingDataProps) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    return (
      <p className="text-center text-xl">
      Viewing data{" "}
      {dateRange?.from && dateRange?.to && dateRange.from.getTime() === dateRange.to.getTime() ? (
        <>
      for{" "}
      <span className="font-semibold">
        {new Date(dateRange.from).toLocaleDateString()}
      </span>
        </>
      ) : dateRange?.from || dateRange?.to ? (
        <>
      from{" "}
      <span className="font-semibold">
        {dateRange?.from ? new Date(dateRange.from).toLocaleDateString() : "the beginning"}
      </span>{" "}
      to{" "}
      <span className="font-semibold">
        {dateRange?.to ? new Date(dateRange.to).toLocaleDateString() : "the present"}
      </span>
        </>
      ) : (
        <>
      from{" "}
      <span className="font-semibold">
        {yesterday.toLocaleDateString()}
      </span>{" "}
      to{" "}
      <span className="font-semibold">
        {now.toLocaleDateString()}
      </span>
        </>
      )}
      </p>
    );
}