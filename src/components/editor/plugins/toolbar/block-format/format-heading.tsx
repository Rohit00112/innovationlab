import { SelectItem } from "@/components/ui/select"
import { blockTypeToBlockName } from "./block-format-data"

export function FormatHeading({ levels }: { levels: string[] }) {
    return (
        <>
            {levels.map((level) => {
                const blockType = level as keyof typeof blockTypeToBlockName
                return (
                    <SelectItem key={level} value={level}>
                        <div className="flex items-center gap-2">
                            {blockTypeToBlockName[blockType].icon}
                            <span>{blockTypeToBlockName[blockType].label}</span>
                        </div>
                    </SelectItem>
                )
            })}
        </>
    )
}
