"use client"

import { Button } from "@/components/ui/button"

interface NoteDisplayProps {
    notes: string
    maxLength?: number
    onViewMore: () => void
}

export function NoteDisplay({ notes, maxLength = 50, onViewMore }: NoteDisplayProps) {
    if (!notes) return <span className="text-blue-200/50 italic text-sm">Sin notas</span>

    const isLong = notes.length > maxLength
    const displayText = isLong ? `${notes.substring(0, maxLength)}...` : notes

    return (
        <div className="flex flex-col gap-1">
            <div className="text-sm text-blue-200">{displayText}</div>
            {isLong && (
                <Button
                    variant="link"
                    className="text-blue-400 hover:text-blue-300 p-0 h-auto text-xs self-start"
                    onClick={onViewMore}
                >
                    Ver más
                </Button>
            )}
        </div>
    )
}
