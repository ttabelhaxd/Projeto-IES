import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Earthquake } from "@/utils/interfaces";

export default function EarthquakesTable({ earthquakes }: { earthquakes: Earthquake[] }) {
  return (
    <div className="border-black border w-[90rem] mx-auto my-10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Date/Hour (UTC)</TableHead>
            <TableHead className="text-center">Latitude</TableHead>
            <TableHead className="text-center">Longitude</TableHead>
            <TableHead className="text-center">Depth</TableHead>
            <TableHead className="text-center">Magnitude</TableHead>
            <TableHead className="text-center">Location</TableHead>
            <TableHead className="text-center">Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {earthquakes
            .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
            .map((earthquake) => (
              <TableRow key={earthquake.timestamp} className="text-center">
                <TableCell>{new Date(earthquake.timestamp).toLocaleString('en-GB', { timeZone: 'UTC' })}</TableCell>
                <TableCell>{earthquake.latitude} {earthquake.latitude >= 0 ? 'N' : 'S'}</TableCell>
                <TableCell>{earthquake.longitude} {earthquake.longitude >= 0 ? 'E' : 'W'}</TableCell>
                <TableCell>{earthquake.depth} km</TableCell>
                <TableCell>{earthquake.magnitude.toFixed(1)}</TableCell>
                <TableCell>{earthquake.location}</TableCell>
                <TableCell>{earthquake.source}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
