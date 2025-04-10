'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PublishedUserBlock({
  nm,
  email,
  _id,
}: {
  nm: string
  email: string
  _id: string
}) {
  const router = useRouter()

  return (
    <Card className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow duration-300 my-4 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Form published by
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 pb-6">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">{nm}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if( typeof window !== 'undefined') {
              router.push(`/profile/${_id}`);
            }
          }}
          className="flex items-center gap-2 text-sm border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          <Eye className="w-4 h-4" />
          View User
        </Button>
      </CardContent>
    </Card>
  )
}
