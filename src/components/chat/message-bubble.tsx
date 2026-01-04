import { cn } from "@/lib/utils/cn"

interface MessageBubbleProps {
    content: string
    role: "user" | "ai"
}

export function MessageBubble({ content, role }: MessageBubbleProps) {
    return (
        <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "px-4 py-3 max-w-[80%] text-sm",
                    role === "user"
                        ? "bg-primary text-white rounded-l-lg rounded-br-none rounded-tr-lg"
                        : "bg-background-elevated text-foreground border border-border rounded-r-lg rounded-bl-none rounded-tl-lg"
                )}
            >
                <p>{content}</p>
            </div>
        </div>
    )
}
