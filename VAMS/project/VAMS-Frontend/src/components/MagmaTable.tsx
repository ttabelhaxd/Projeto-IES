import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const magmaTypes = [
  {
    type: 'Basaltic',
    silicon: '45-52%',
    iron: '8-12%',
    aluminum: '10-18%',
    calcium: '8-12%',
    sodium: '1-4%',
    magnesium: '5-15%',
    potassium: '0.1-1%',
  },
  {
    type: 'Andesitic',
    silicon: '52-63%',
    iron: '5-8%',
    aluminum: '15-18%',
    calcium: '5-9%',
    sodium: '2-6%',
    magnesium: '3-8%',
    potassium: '1-3%',
  },
  {
    type: 'Rhyolitic',
    silicon: '63-75%',
    iron: '1-5%',
    aluminum: '12-16%',
    calcium: '1-4%',
    sodium: '3-8%',
    magnesium: '0.5-2%',
    potassium: '3-5%',
  },
];

const MagmaTable = () => {
  return (
    <div className="border-black border w-[100rem] mx-auto my-10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Magma Type</TableHead>
            <TableHead className="text-center">Silicon (SiO₂)</TableHead>
            <TableHead className="text-center">Iron (FeO/Fe₂O₃)</TableHead>
            <TableHead className="text-center">Aluminum (Al₂O₃)</TableHead>
            <TableHead className="text-center">Calcium (CaO)</TableHead>
            <TableHead className="text-center">Sodium (Na₂O)</TableHead>
            <TableHead className="text-center">Magnesium (MgO)</TableHead>
            <TableHead className="text-center">Potassium (K₂O)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {magmaTypes.map((magma, index) => (
            <TableRow
              key={magma.type}
              className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-200 text-center" : "hover:bg-gray-200 text-center"}
            >
              <TableCell className="w-1/8">{magma.type}</TableCell>
              <TableCell className="w-1/8">{magma.silicon}</TableCell>
              <TableCell className="w-1/8">{magma.iron}</TableCell>
              <TableCell className="w-1/8">{magma.aluminum}</TableCell>
              <TableCell className="w-1/8">{magma.calcium}</TableCell>
              <TableCell className="w-1/8">{magma.sodium}</TableCell>
              <TableCell className="w-1/8">{magma.magnesium}</TableCell>
              <TableCell className="w-1/8">{magma.potassium}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MagmaTable;