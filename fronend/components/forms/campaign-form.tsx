import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"

interface Game {
  id: string
  name: string
}

export function CampaignForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [gameId, setGameId] = useState('')
  const [games, setGames] = useState<Game[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchGames = async () => {
      const { data } = await supabase.from('games').select('*')
      setGames(data || [])
      if (data && data.length > 0) {
        setGameId(data[0].id)
      }
    }
    fetchGames()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase
      .from('campaigns')
      .insert([{
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        game_id: gameId
      }])

    if (error) {
      console.error('Error creating campaign:', error)
      return
    }

    setName('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="game">Game</Label>
        <select
          id="game"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          {games.map(game => (
            <option key={game.id} value={game.id}>{game.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter campaign name"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter campaign description"
          required
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          type="date"
          required
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          type="date"
          required
        />
      </div>
      <Button type="submit">Add Campaign</Button>
    </form>
  )
} 