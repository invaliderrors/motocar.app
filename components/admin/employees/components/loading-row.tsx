export function LoadingRow() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b">
          <td className="px-4 py-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted animate-pulse rounded w-24" />
          </td>
          <td className="px-4 py-3">
            <div className="h-6 bg-muted animate-pulse rounded w-20" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted animate-pulse rounded w-28" />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
