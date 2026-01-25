import { SelectItem } from "@/components/ui/select"
import { blockTypeToBlockName } from "./block-format-data"

export function FormatParagraph() {
    return (
        <SelectItem value="paragraph">
            <div className="flex items-center gap-2">
                {blockTypeToBlockName.paragraph.icon}
                <span>{blockTypeToBlockName.paragraph.label}</span>
            </div>
        </SelectItem>
    )
}
