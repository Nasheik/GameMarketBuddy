import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"

export function OrganizationForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase
      .from('organizations')
      .insert([{ name }])

    if (error) {
      console.error('Error creating organization:', error)
      return
    }

    setName('')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter organization name"
          required
        />
      </div>
      <Button type="submit">Add Organization</Button>
    </form>
  )
} 