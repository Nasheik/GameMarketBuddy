import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"

interface Organization {
  id: string
  name: string
}

export function GameForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [organizationId, setOrganizationId] = useState('')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchOrganizations = async () => {
      const { data } = await supabase.from('organizations').select('*')
      setOrganizations(data || [])
      if (data && data.length > 0) {
        setOrganizationId(data[0].id)
      }
    }
    fetchOrganizations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase
      .from('games')
      .insert([{
        name,
        description,
        cover_image: coverImage,
        organization_id: organizationId
      }])

    if (error) {
      console.error('Error creating game:', error)
      return
    }

    setName('')
    setDescription('')
    setCoverImage('')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="organization">Organization</Label>
        <select
          id="organization"
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="name">Game Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter game name"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter game description"
          required
        />
      </div>
      <div>
        <Label htmlFor="coverImage">Cover Image URL</Label>
        <Input
          id="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="Enter cover image URL"
          type="url"
        />
      </div>
      <Button type="submit">Add Game</Button>
    </form>
  )
} 