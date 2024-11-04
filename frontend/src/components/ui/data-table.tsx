import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'
import Loading from './Loading'

interface Column<TData> {
  header: string
  accessor?: keyof TData
  render?: (row: TData) => React.ReactElement
  colSpan?: number
  className?: string
}

interface DataTableProps<TData> {
  data: TData[]
  loading: boolean
  columns: Column<TData>[]
  page: number
  setPage: (page: number) => void
  count: number
  showNumber?: boolean
}

export function DataTable<TData>({ data, loading, columns, page, setPage, count, showNumber = false }: DataTableProps<TData>) {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <div className="relative">
          <Table className="w-full whitespace-nowrap">
            <TableHeader>
              <TableRow>
                {showNumber && <TableHead>No</TableHead>}
                {columns.map((column) => (
                  <TableHead key={String(column.accessor ?? column.header)} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-4 text-center">
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {showNumber && <TableCell>{rowIndex + 1 + (page - 1) * 10}</TableCell>}
                    {columns.map((column) => (
                      <TableCell key={String(column.accessor ?? column.header)} className={column.className} colSpan={column.colSpan}>
                        {column.render?.(row) ?? String(row[column.accessor as keyof TData] || '-')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-4 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination page={page} totalPages={Math.ceil(count / 10)} onPageChange={(p) => setPage(p)} />
    </div>
  )
}

const DataTablePagination: React.FC<{
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}> = ({ page, totalPages, onPageChange }) => {
  const pageNumbers: number[] = []
  const offset = 2

  for (let i = page - offset; i <= page + offset; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={page <= 1 ? 'pointer-events-none text-zinc-400' : 'cursor-pointer'}
            onClick={() => page > 1 && onPageChange(page - 1)}
          />
        </PaginationItem>
        {page - offset > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pageNumbers.map((p) => (
          <PaginationItem className="cursor-pointer" key={p}>
            <PaginationLink onClick={() => onPageChange(p)} isActive={page === p}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page + offset < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={page >= totalPages ? 'pointer-events-none text-zinc-400' : 'cursor-pointer'}
            onClick={() => page < totalPages && onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
