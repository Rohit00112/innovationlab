import { SelectItem } from "@/components/ui/select"
import { blockTypeToBlockName } from "./block-format-data"

export function FormatNumberedList() {
    return (
        <SelectItem value="number">
            <div className="flex items-center gap-2">
                {blockTypeToBlockName.number.icon}
                <span>{blockTypeToBlockName.number.label}</span>
            </div>
        </SelectItem>
    )
}
