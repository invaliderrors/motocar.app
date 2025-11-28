"use client"

import type React from "react"
import { useState } from "react"
import { Form } from "@/components/ui/form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { User as UserType } from "@/lib/types"
import { UserFormTabs } from "./components/form/UserFormTabs"
import { useUserForm } from "./hooks/useUserForm"
import { DialogHeader } from "./components/form/UserFormDialogHeader"

type Props = {
  children: React.ReactNode
  userId?: string
  userData?: UserType
  onCreated?: (user: UserType) => void
}

export function UserForm({ children, userId, userData, onCreated }: Props) {
  const [open, setOpen] = useState(false)

  const { form, loading, activeTab, setActiveTab, onSubmit, goToNextTab, goToPreviousTab, resetForm, isEditing } =
    useUserForm({
      userId,
      userData,
      onCreated,
      onClose: () => {
        setOpen(false)
        resetForm()
      },
    })

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-gradient-to-br from-card to-background">
        <div className="relative">
          <DialogHeader isEditing={isEditing} onClose={handleClose} />

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <UserFormTabs
                  control={form.control}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  loading={loading}
                  isEditing={isEditing}
                  onNext={goToNextTab}
                  onPrevious={goToPreviousTab}
                />
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
