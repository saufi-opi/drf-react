import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import Loading from '@/components/ui/Loading'
import Search from '@/components/ui/Search'
import { useAuth } from '@/hooks/use-auth'
import { useTable } from '@/hooks/use-table'
import { User } from '@/types/global'
import { Eye, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { logout, loading } = useAuth()
  const table = useTable<User>({ url: 'api/v1/users/' })

  return (
    <div className="space-y-4 p-4">
      <div className="text-right">
        <Button variant="destructive" onClick={logout} disabled={loading}>
          {loading ? <Loading /> : 'Logout'}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users List</CardTitle>
            <div className="flex items-center gap-2">
              <Search initialValue={table.search} onSearch={table.handleSearch} />
              <Link to="/add">
                <Button>New User</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                header: 'Id',
                accessor: 'id'
              },
              {
                header: 'Username',
                accessor: 'username'
              },
              {
                header: 'Email',
                accessor: 'email'
              },
              {
                header: 'Actions',
                colSpan: 10,
                className: 'sticky right-0 z-10 bg-background',
                render: (row) => (
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => alert(`View ${row.username}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => alert(`Edit ${row.username}`)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )
              }
            ]}
            {...table}
            showNumber
          />
        </CardContent>
      </Card>
    </div>
  )
}
