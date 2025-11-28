'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function SessionHandler() {
    const searchParams = useSearchParams()
    const [showExpiredDialog, setShowExpiredDialog] = useState(false)

    useEffect(() => {
        const expired = searchParams.get('expired')
        if (expired === 'true') {
            setShowExpiredDialog(true)
        }
    }, [searchParams])

    return (
        <Dialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sesión expirada</DialogTitle>
                    <DialogDescription>
                        Tu sesión ha expirado por inactividad o por tiempo límite. Por favor, inicia sesión nuevamente.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setShowExpiredDialog(false)}>Entendido</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SessionHandler
