"use client"

import { useCallback, useEffect, useState } from "react"
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    ELEMENT_TRANSFORMERS,
    MULTILINE_ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import { CodeHighlightNode, CodeNode, $createCodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListItemNode,
    ListNode,
    $isListNode,
} from "@lexical/list"
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    HeadingNode,
    HeadingTagType,
    QuoteNode,
} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import {
    $findMatchingParent,
    $getNearestNodeOfType,
    mergeRegister,
} from "@lexical/utils"
import {
    InitialConfigType,
    LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import {
    HorizontalRuleNode,
    INSERT_HORIZONTAL_RULE_COMMAND,
} from "@lexical/react/LexicalHorizontalRuleNode"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    EditorState,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    TextFormatType,
    UNDO_COMMAND,
} from "lexical"
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link,
    List,
    ListOrdered,
    Minus,
    Pilcrow,
    Quote,
    Redo,
    Strikethrough,
    Undo,
} from "lucide-react"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { CodeHighlightPlugin } from "@/components/editor/plugins/code-highlight-plugin"
import { validateUrl } from "@/components/editor/utils/url"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Only standard markdown transformers — no custom image/tweet/table/emoji
const MARKDOWN_TRANSFORMERS = [
    ...ELEMENT_TRANSFORMERS,
    ...MULTILINE_ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS,
]

// Minimal node set for markdown
const markdownNodes = [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
]

interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = "Write using markdown…",
    className,
}: MarkdownEditorProps) {
    const initialConfig: InitialConfigType = {
        namespace: "MarkdownEditor",
        theme: editorTheme,
        nodes: markdownNodes,
        onError: (error: Error) => {
            console.error(error)
        },
        editorState: () => {
            $convertFromMarkdownString(value || "", MARKDOWN_TRANSFORMERS)
        },
    }

    return (
        <div
            className={cn(
                "bg-background overflow-hidden rounded-lg border shadow-sm",
                className
            )}
        >
            <LexicalComposer initialConfig={initialConfig}>
                <TooltipProvider delayDuration={300}>
                    <MarkdownToolbar />
                    <EditorContent placeholder={placeholder} />
                    <MarkdownChangePlugin onChange={onChange} />
                </TooltipProvider>
            </LexicalComposer>
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/*  Change plugin — converts to markdown string on every edit                  */
/* -------------------------------------------------------------------------- */

function MarkdownChangePlugin({ onChange }: { onChange: (md: string) => void }) {
    const handleChange = useCallback(
        (editorState: EditorState) => {
            editorState.read(() => {
                const md = $convertToMarkdownString(MARKDOWN_TRANSFORMERS)
                onChange(md)
            })
        },
        [onChange]
    )

    return <OnChangePlugin ignoreSelectionChange onChange={handleChange} />
}

/* -------------------------------------------------------------------------- */
/*  Editor content area + functional plugins                                   */
/* -------------------------------------------------------------------------- */

function EditorContent({ placeholder }: { placeholder: string }) {
    return (
        <div className="relative">
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        placeholder={placeholder}
                        className="ContentEditable__root relative block min-h-50 overflow-auto px-4 py-3 text-sm focus:outline-none"
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <HorizontalRulePlugin />
            <TabIndentationPlugin />
            <ClickableLinkPlugin />
            <CodeHighlightPlugin />
            <LexicalLinkPlugin validateUrl={validateUrl} />
            <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/*  Toolbar                                                                    */
/* -------------------------------------------------------------------------- */

function MarkdownToolbar() {
    const [editor] = useLexicalComposerContext()

    // State
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isStrikethrough, setIsStrikethrough] = useState(false)
    const [isCode, setIsCode] = useState(false)
    const [blockType, setBlockType] = useState("paragraph")

    // Detect current formatting on selection change
    const $updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return

        setIsBold(selection.hasFormat("bold"))
        setIsItalic(selection.hasFormat("italic"))
        setIsStrikethrough(selection.hasFormat("strikethrough"))
        setIsCode(selection.hasFormat("code"))

        const anchorNode = selection.anchor.getNode()
        let element =
            anchorNode.getKey() === "root"
                ? anchorNode
                : $findMatchingParent(anchorNode, (e) => {
                    const parent = e.getParent()
                    return parent !== null && $isRootOrShadowRoot(parent)
                })

        if (element === null) {
            element = anchorNode.getTopLevelElementOrThrow()
        }

        if ($isListNode(element)) {
            const parentList = $getNearestNodeOfType<ListNode>(
                anchorNode,
                ListNode
            )
            const type = parentList
                ? parentList.getListType()
                : element.getListType()
            setBlockType(type)
        } else {
            const type = $isHeadingNode(element)
                ? element.getTag()
                : element.getType()
            setBlockType(type)
        }
    }, [])

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar()
                    return false
                },
                COMMAND_PRIORITY_CRITICAL
            ),
            editor.registerCommand<boolean>(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload)
                    return false
                },
                COMMAND_PRIORITY_CRITICAL
            ),
            editor.registerCommand<boolean>(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload)
                    return false
                },
                COMMAND_PRIORITY_CRITICAL
            ),
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar()
                })
            })
        )
    }, [editor, $updateToolbar])

    // Format helpers
    const formatText = (format: TextFormatType) =>
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)

    const formatBlock = (type: string) => {
        editor.update(() => {
            const selection = $getSelection()
            if (!$isRangeSelection(selection)) return

            if (type === "paragraph") {
                $setBlocksType(selection, () => $createParagraphNode())
            } else if (type.startsWith("h")) {
                $setBlocksType(selection, () =>
                    $createHeadingNode(type as HeadingTagType)
                )
            } else if (type === "quote") {
                $setBlocksType(selection, () => $createQuoteNode())
            } else if (type === "code") {
                $setBlocksType(selection, () => $createCodeNode())
            } else if (type === "bullet") {
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            } else if (type === "number") {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            }
        })
    }

    const insertLink = () => {
        const url = prompt("Enter URL:")
        if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }
    }

    const insertHR = () =>
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)

    // Active-style helper
    const isActive = (type: string) => blockType === type

    return (
        <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
            {/* Undo / Redo */}
            <ToolbarButton
                icon={Undo}
                label="Undo"
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                disabled={!canUndo}
            />
            <ToolbarButton
                icon={Redo}
                label="Redo"
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                disabled={!canRedo}
            />

            <Separator orientation="vertical" className="mx-1 h-6!" />

            {/* Block format */}
            <ToolbarButton
                icon={Pilcrow}
                label="Paragraph"
                onClick={() => formatBlock("paragraph")}
                active={isActive("paragraph")}
            />
            <ToolbarButton
                icon={Heading1}
                label="Heading 1"
                onClick={() => formatBlock("h1")}
                active={isActive("h1")}
            />
            <ToolbarButton
                icon={Heading2}
                label="Heading 2"
                onClick={() => formatBlock("h2")}
                active={isActive("h2")}
            />
            <ToolbarButton
                icon={Heading3}
                label="Heading 3"
                onClick={() => formatBlock("h3")}
                active={isActive("h3")}
            />

            <Separator orientation="vertical" className="mx-1 h-6!" />

            {/* Inline format */}
            <ToolbarButton
                icon={Bold}
                label="Bold"
                onClick={() => formatText("bold")}
                active={isBold}
            />
            <ToolbarButton
                icon={Italic}
                label="Italic"
                onClick={() => formatText("italic")}
                active={isItalic}
            />
            <ToolbarButton
                icon={Strikethrough}
                label="Strikethrough"
                onClick={() => formatText("strikethrough")}
                active={isStrikethrough}
            />
            <ToolbarButton
                icon={Code}
                label="Inline Code"
                onClick={() => formatText("code")}
                active={isCode}
            />

            <Separator orientation="vertical" className="mx-1 h-6!" />

            {/* Lists */}
            <ToolbarButton
                icon={List}
                label="Bullet List"
                onClick={() => formatBlock("bullet")}
                active={isActive("bullet")}
            />
            <ToolbarButton
                icon={ListOrdered}
                label="Numbered List"
                onClick={() => formatBlock("number")}
                active={isActive("number")}
            />

            {/* Quote & code block */}
            <ToolbarButton
                icon={Quote}
                label="Block Quote"
                onClick={() => formatBlock("quote")}
                active={isActive("quote")}
            />

            <Separator orientation="vertical" className="mx-1 h-6!" />

            {/* Link & HR */}
            <ToolbarButton icon={Link} label="Insert Link" onClick={insertLink} />
            <ToolbarButton
                icon={Minus}
                label="Horizontal Rule"
                onClick={insertHR}
            />
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/*  ToolbarButton                                                              */
/* -------------------------------------------------------------------------- */

function ToolbarButton({
    icon: Icon,
    label,
    onClick,
    active,
    disabled,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick: () => void
    active?: boolean
    disabled?: boolean
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-7 w-7",
                        active && "bg-accent text-accent-foreground"
                    )}
                    onClick={onClick}
                    disabled={disabled}
                    aria-label={label}
                >
                    <Icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
                {label}
            </TooltipContent>
        </Tooltip>
    )
}
