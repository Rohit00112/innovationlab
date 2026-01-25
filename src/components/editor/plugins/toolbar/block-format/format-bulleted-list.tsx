import { SelectItem } from "@/components/ui/select"
import { blockTypeToBlockName } from "./block-format-data"

export function FormatBulletedList() {
    return (
        <SelectItem value="bullet">
            <div className="flex items-center gap-2">
                {blockTypeToBlockName.bullet.icon}
                <span>{blockTypeToBlockName.bullet.label}</span>
            </div>
        </SelectItem>
    )
}
