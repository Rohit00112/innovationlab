import { SelectItem } from "@/components/ui/select"
import { blockTypeToBlockName } from "./block-format-data"

export function FormatQuote() {
    return (
        <SelectItem value="quote">
            <div className="flex items-center gap-2">
                {blockTypeToBlockName.quote.icon}
                <span>{blockTypeToBlockName.quote.label}</span>
            </div>
        </SelectItem>
    )
}
