"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, AlertTriangle, Clock, MapPin, Calendar, CheckCircle, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const urgentTasks = [
  {
    id: "T001",
    uid: "RFM-1705123450-URG001",
    componentType: "Liner",
    location: "Line NFR-012, KM 67.9",
    priority: "Urgent",
    daysToFail: 8,
    assignedDate: "2024-01-15",
    description: "Critical wear detected on liner component",
    completed: false,
  },
  {
    id: "T002",
    uid: "RFM-1705123451-URG002",
    componentType: "Rail Pad",
    location: "Line SR-078, KM 156.4",
    priority: "Urgent",
    daysToFail: 12,
    assignedDate: "2024-01-14",
    description: "Excessive vibration patterns detected",
    completed: false,
  },
  {
    id: "T003",
    uid: "RFM-1705123452-URG003",
    componentType: "ERC",
    location: "Line WR-045, KM 89.7",
    priority: "Urgent",
    daysToFail: 5,
    assignedDate: "2024-01-16",
    description: "Metal fatigue indicators present",
    completed: false,
  },
]

const mediumTasks = [
  {
    id: "T004",
    uid: "RFM-1705123453-MED001",
    componentType: "Sleeper",
    location: "Line ER-023, KM 203.3",
    priority: "Medium",
    daysToFail: 45,
    assignedDate: "2024-01-13",
    description: "Routine inspection due",
    completed: false,
  },
  {
    id: "T005",
    uid: "RFM-1705123454-MED002",
    componentType: "Rail Pad",
    location: "Line CR-089, KM 78.2",
    priority: "Medium",
    daysToFail: 38,
    assignedDate: "2024-01-12",
    description: "Scheduled maintenance check",
    completed: false,
  },
]

const completedTasks = [
  {
    id: "T006",
    uid: "RFM-1705123455-COM001",
    componentType: "Liner",
    location: "Line NR-001, KM 125.5",
    priority: "Urgent",
    daysToFail: 10,
    assignedDate: "2024-01-11",
    completedDate: "2024-01-15",
    description: "Emergency inspection completed",
    completed: true,
  },
]

export default function WorkerNotifications() {
  const [tasks, setTasks] = useState([...urgentTasks, ...mediumTasks, ...completedTasks])
  const { toast } = useToast()

  const handleTaskComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedDate: !task.completed ? new Date().toISOString().split("T")[0] : undefined,
            }
          : task,
      ),
    )

    const task = tasks.find((t) => t.id === taskId)
    if (task && !task.completed) {
      toast({
        title: "Task Completed",
        description: `Inspection for ${task.componentType} at ${task.location} marked as complete`,
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Basic":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return AlertTriangle
      case "Medium":
        return Clock
      case "Basic":
        return CheckCircle
      default:
        return CheckCircle
    }
  }

  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasksList = tasks.filter((task) => task.completed)
  const urgentCount = activeTasks.filter((task) => task.priority === "Urgent").length
  const mediumCount = activeTasks.filter((task) => task.priority === "Medium").length

  return (
    <DashboardLayout role="worker" title="Notifications">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Urgent Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Medium Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{mediumCount}</div>
                <p className="text-xs text-muted-foreground">Scheduled inspections</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedTasksList.length}</div>
                <p className="text-xs text-muted-foreground">Tasks finished</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Active Inspection Tasks
                </CardTitle>
                <CardDescription>Components requiring inspection based on AI predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTasks
                    .sort((a, b) => {
                      // Sort by priority (Urgent first) then by days to fail
                      if (a.priority === "Urgent" && b.priority !== "Urgent") return -1
                      if (a.priority !== "Urgent" && b.priority === "Urgent") return 1
                      return a.daysToFail - b.daysToFail
                    })
                    .map((task, index) => {
                      const PriorityIcon = getPriorityIcon(task.priority)
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                            task.priority === "Urgent"
                              ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => handleTaskComplete(task.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <PriorityIcon className="h-4 w-4" />
                                  <h3 className="font-medium">{task.componentType} Inspection</h3>
                                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                                  {task.priority === "Urgent" && (
                                    <Badge variant="destructive" className="animate-pulse">
                                      {task.daysToFail} days left
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {task.location}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    UID: {task.uid.slice(-10)}...
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Assigned: {task.assignedDate}
                                  </p>
                                  <p>{task.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{task.daysToFail}</div>
                              <p className="text-xs text-muted-foreground">days to fail</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Completed Tasks */}
        {completedTasksList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Completed Tasks
                </CardTitle>
                <CardDescription>Recently completed inspections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedTasksList.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{task.componentType} Inspection</h3>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Completed
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {task.location}
                              </p>
                              <p className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Completed: {task.completedDate}
                              </p>
                              <p>{task.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTasks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending inspection tasks at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
