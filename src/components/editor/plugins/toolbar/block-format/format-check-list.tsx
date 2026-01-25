import { SelectItem } from "@/components/ui/select"
import { blockTypeToBlockName } from "./block-format-data"

export function FormatCheckList() {
    return (
        <SelectItem value="check">
            <div className="flex items-center gap-2">
                {blockTypeToBlockName.check.icon}
                <span>{blockTypeToBlockName.check.label}</span>
            </div>
        </SelectItem>
    )
}
