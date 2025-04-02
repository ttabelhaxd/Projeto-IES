import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GasIndicatorTable = () => {
  const gases = [
    { name: "CO₂ (tons/day)", low: "0-500", moderate: "500-5,000", high: "5,000-30,000", extreme: ">30,000" },
    { name: "SO₂ (tons/day)", low: "0-50", moderate: "50-500", high: "500-5,000", extreme: ">5,000" },
    { name: "H₂S (tons/day)", low: "0-1", moderate: "1-5", high: "5-10", extreme: ">10" },
    { name: "HCl (tons/day)", low: "0-10", moderate: "10-100", high: "100-500", extreme: ">500" },
  ];

  return (
    <div className="border-black border w-[100rem] mx-auto my-10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Gas</TableHead>
            <TableHead className="text-center">Low</TableHead>
            <TableHead className="text-center">Moderate</TableHead>
            <TableHead className="text-center">High</TableHead>
            <TableHead className="text-center">Extreme</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gases.map((gas, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-200 text-center" : "hover:bg-gray-200 text-center"}
            >
              <TableCell className="w-1/5">{gas.name}</TableCell>
              <TableCell className="w-1/5 bg-green-200">{gas.low}</TableCell>
              <TableCell className="w-1/5 bg-yellow-200">{gas.moderate}</TableCell>
              <TableCell className="w-1/5 bg-orange-200">{gas.high}</TableCell>
              <TableCell className="w-1/5 bg-red-200">{gas.extreme}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GasIndicatorTable;