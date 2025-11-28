"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Users } from "lucide-react"
import type { Control } from "react-hook-form"
import { UserFormValues } from "../../hooks/useUserForm"
import { FormNavigation } from "./UserFormNavigation"
import { PersonalInfoTab } from "./UserFormPersonalInfo"
import { ReferenceInfoTab } from "./UserFormReferenceInfoTab"


interface UserFormTabsProps {
    control: Control<UserFormValues>
    activeTab: string
    setActiveTab: (tab: string) => void
    loading: boolean
    isEditing: boolean
    onNext: () => void
    onPrevious: () => void
}

export function UserFormTabs({
    control,
    activeTab,
    setActiveTab,
    loading,
    isEditing,
    onNext,
    onPrevious,
}: UserFormTabsProps) {
    return (
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Información Personal</span>
                </TabsTrigger>
                <TabsTrigger value="reference" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Información de Referencia</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
                <PersonalInfoTab control={control} />
                <FormNavigation
                    activeTab={activeTab}
                    loading={loading}
                    isEditing={isEditing}
                    onNext={onNext}
                    onPrevious={onPrevious}
                />
            </TabsContent>

            <TabsContent value="reference">
                <ReferenceInfoTab control={control} />
                <FormNavigation
                    activeTab={activeTab}
                    loading={loading}
                    isEditing={isEditing}
                    onNext={onNext}
                    onPrevious={onPrevious}
                />
            </TabsContent>
        </Tabs>
    )
}
