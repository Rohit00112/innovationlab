import {
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Quote,
    List,
    ListOrdered,
    Type,
    CheckSquare,
    Code,
} from "lucide-react"

export const blockTypeToBlockName = {
    paragraph: {
        label: "Normal",
        icon: <Type className="h-4 w-4" />,
    },
    h1: {
        label: "Heading 1",
        icon: <Heading1 className="h-4 w-4" />,
    },
    h2: {
        label: "Heading 2",
        icon: <Heading2 className="h-4 w-4" />,
    },
    h3: {
        label: "Heading 3",
        icon: <Heading3 className="h-4 w-4" />,
    },
    bullet: {
        label: "Bullet List",
        icon: <List className="h-4 w-4" />,
    },
    number: {
        label: "Numbered List",
        icon: <ListOrdered className="h-4 w-4" />,
    },
    check: {
        label: "Check List",
        icon: <CheckSquare className="h-4 w-4" />,
    },
    quote: {
        label: "Quote",
        icon: <Quote className="h-4 w-4" />,
    },
    code: {
        label: "Code Block",
        icon: <Code className="h-4 w-4" />,
    },
}
