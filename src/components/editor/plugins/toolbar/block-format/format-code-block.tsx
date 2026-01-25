import { SelectItem } from "@/components/ui/select"
import { blockTypeToBlockName } from "./block-format-data"

export function FormatCodeBlock() {
    return (
        <SelectItem value="code">
            <div className="flex items-center gap-2">
                {blockTypeToBlockName.code.icon}
                <span>{blockTypeToBlockName.code.label}</span>
            </div>
        </SelectItem>
    )
}
