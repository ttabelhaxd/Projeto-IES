import { Eruption } from "@/utils/interfaces";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const HistoryTable = ({ eruptions }: { eruptions: Eruption[] }) => {

  return (
    <>
      <div className="border-black border w-[100rem] mx-auto my-10 rounded-lg overflow-hidden">
        {eruptions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">VEI</TableHead>
                <TableHead className="text-center">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eruptions
                .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
                .map((eruption, index) => (
                  <TableRow
                    key={eruption.timestamp}
                    className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-200 text-center" : "hover:bg-gray-200 text-center"}
                  >
                    <TableCell className="w-1/6">{new Date(eruption.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="w-1/6">{eruption.type}</TableCell>
                    <TableCell className="w-1/6">{eruption.vei}</TableCell>
                    <TableCell className="w-1/2">{eruption.description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 text-red-500">No eruption data available for the selected volcano.</div>
        )}
      </div>
    </>
  );
};

export default HistoryTable;