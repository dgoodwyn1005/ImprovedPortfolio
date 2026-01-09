"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Trash2, Mail, RefreshCw, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Submission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  company_slug: string | null
  submission_type: string
  status: string
  created_at: string
}

export function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  const fetchSubmissions = async () => {
    setIsLoading(true)
    const supabase = createClient()

    let query = supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })

    if (filter !== "all") {
      query = query.eq("status", filter)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching submissions:", error)
    } else {
      setSubmissions(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [filter])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (!error) {
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return

    const supabase = createClient()
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

    if (!error) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "read":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "replied":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "archived":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getTypeLabel = (type: string, companySlug: string | null) => {
    if (companySlug) {
      return `${type} (${companySlug})`
    }
    return type
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline">{submissions.length} submissions</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSubmissions}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {submission.name}
                      <Badge variant="outline" className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      <Badge variant="secondary">
                        {getTypeLabel(submission.submission_type, submission.company_slug)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <a href={`mailto:${submission.email}`} className="hover:underline flex items-center gap-1">
                        {submission.email}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={submission.status} onValueChange={(value) => updateStatus(submission.id, value)}>
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteSubmission(submission.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {submission.subject && (
                  <p className="font-medium text-foreground mb-2">Subject: {submission.subject}</p>
                )}
                <p className="text-muted-foreground whitespace-pre-wrap">{submission.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
