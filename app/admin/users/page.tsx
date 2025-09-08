"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Search, Plus, Edit, Trash2, Shield, UserCheck, Clock } from "lucide-react"

const userData = [
  {
    id: "U001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@railway.gov.in",
    role: "Factory Manager",
    zone: "Northern Railway",
    status: "Active",
    lastLogin: "2024-01-15 14:30",
    deploymentsCount: 45,
  },
  {
    id: "U002",
    name: "Priya Sharma",
    email: "priya.sharma@railway.gov.in",
    role: "Worker",
    zone: "Western Railway",
    status: "Active",
    lastLogin: "2024-01-15 16:45",
    scansCount: 234,
  },
  {
    id: "U003",
    name: "Amit Singh",
    email: "amit.singh@railway.gov.in",
    role: "Worker",
    zone: "Eastern Railway",
    status: "Active",
    lastLogin: "2024-01-15 12:20",
    scansCount: 189,
  },
  {
    id: "U004",
    name: "Rahee Track Technologies",
    email: "contact@raheetrack.com",
    role: "Vendor",
    zone: "Multi-Zone",
    status: "Active",
    lastLogin: "2024-01-15 09:15",
    componentsCreated: 12500,
  },
  {
    id: "U005",
    name: "Sunita Patel",
    email: "sunita.patel@railway.gov.in",
    role: "Factory Manager",
    zone: "Southern Railway",
    status: "Inactive",
    lastLogin: "2024-01-10 11:30",
    deploymentsCount: 23,
  },
  {
    id: "U006",
    name: "Dr. Vikram Mehta",
    email: "vikram.mehta@railway.gov.in",
    role: "Admin",
    zone: "Central Office",
    status: "Active",
    lastLogin: "2024-01-15 17:00",
    systemAccess: "Full",
  },
]

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(userData)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.role.toLowerCase().includes(term.toLowerCase()) ||
        user.zone.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "Factory Manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Worker":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Vendor":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return Shield
      case "Factory Manager":
        return UserCheck
      case "Worker":
        return Users
      case "Vendor":
        return Users
      default:
        return Users
    }
  }

  const activeUsers = filteredUsers.filter((user) => user.status === "Active").length
  const totalUsers = filteredUsers.length
  const roleDistribution = {
    Admin: filteredUsers.filter((user) => user.role === "Admin").length,
    "Factory Manager": filteredUsers.filter((user) => user.role === "Factory Manager").length,
    Worker: filteredUsers.filter((user) => user.role === "Worker").length,
    Vendor: filteredUsers.filter((user) => user.role === "Vendor").length,
  }

  return (
    <DashboardLayout role="admin" title="User Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, role, or zone..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">{activeUsers} active users</p>
              </CardContent>
            </Card>
          </motion.div>

          {Object.entries(roleDistribution).map(([role, count], index) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{role}s</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">{Math.round((count / totalUsers) * 100)}% of total</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                System Users
              </CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions across the railway system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user, index) => {
                  const RoleIcon = getRoleIcon(user.role)
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{user.name}</h3>
                            <Badge className={getRoleColor(user.role)}>
                              <RoleIcon className="mr-1 h-3 w-3" />
                              {user.role}
                            </Badge>
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{user.zone}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last login: {user.lastLogin}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          {user.role === "Worker" && (
                            <>
                              <div className="font-medium">{user.scansCount}</div>
                              <div className="text-muted-foreground">Scans</div>
                            </>
                          )}
                          {user.role === "Factory Manager" && (
                            <>
                              <div className="font-medium">{user.deploymentsCount}</div>
                              <div className="text-muted-foreground">Deployments</div>
                            </>
                          )}
                          {user.role === "Vendor" && (
                            <>
                              <div className="font-medium">{user.componentsCreated?.toLocaleString()}</div>
                              <div className="text-muted-foreground">Components</div>
                            </>
                          )}
                          {user.role === "Admin" && (
                            <>
                              <div className="font-medium">{user.systemAccess}</div>
                              <div className="text-muted-foreground">Access Level</div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "No users have been added yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
