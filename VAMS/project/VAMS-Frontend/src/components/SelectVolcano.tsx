import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useVolcanoContext } from "@/utils/VolcanoContext";

export function SelectVolcano() {
  const { currVolcano, setCurrVolcano, volcanoList } = useVolcanoContext();

  useEffect(() => {
    if (currVolcano) {
      console.log(currVolcano.name, " - ", currVolcano.id);
    }
  }, [currVolcano]);

  return (
    <Select
      value={currVolcano?.id}
      onValueChange={(value) => {
        const selectedVolcano = volcanoList.find(
          (volcano) => volcano.id === value
        );
        if (selectedVolcano) {
          setCurrVolcano(selectedVolcano); // Updates the context
          console.log(
            "Selected Volcano (local):",
            selectedVolcano.name,
            "-",
            selectedVolcano.id
          );
        }
      }}
    >
      <SelectTrigger className="w-fit">
        <SelectValue
          placeholder={
            currVolcano
              ? currVolcano.name
              : volcanoList.length > 0
              ? volcanoList[0].name
              : "Select a volcano"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {volcanoList.map((volcano) => (
            <SelectItem key={volcano.id} value={volcano.id}>
              {volcano.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}