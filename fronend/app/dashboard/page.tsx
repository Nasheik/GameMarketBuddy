'use client'

import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { OrganizationForm } from "@/components/forms/organization-form";
import { GameForm } from "@/components/forms/game-form";
import { CampaignForm } from "@/components/forms/campaign-form";
import { UserForm } from "@/components/forms/user-form";

interface Organization {
  id: string;
  name: string;
}

interface Game {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  cover_image: string;
}

interface Campaign {
  id: string;
  game_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface User {
  id: string;
  organization_id: string;
  role: string;
  full_name: string;
  avatar_url: string;
}

export default function DashboardPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [users, setUsers] = useState<User[]>([])
  const supabase = createClient()

  const fetchData = async () => {
    const { data: orgs } = await supabase.from("organizations").select("*")
    const { data: gms } = await supabase.from("games").select("*")
    const { data: cmps } = await supabase.from("campaigns").select("*")
    const { data: usrs } = await supabase.from("users").select("*")

    setOrganizations(orgs || [])
    setGames(gms || [])
    setCampaigns(cmps || [])
    setUsers(usrs || [])
  }

  useEffect(() => {
    fetchData()
  }, [])

  const organizationColumns = [
    { header: "ID", accessor: "id" as keyof Organization },
    { header: "Name", accessor: "name" as keyof Organization },
  ];

  const gameColumns = [
    { header: "ID", accessor: "id" as keyof Game },
    { header: "Organization", accessor: "organization_id" as keyof Game },
    { header: "Name", accessor: "name" as keyof Game },
    { header: "Description", accessor: "description" as keyof Game },
  ];

  const campaignColumns = [
    { header: "ID", accessor: "id" as keyof Campaign },
    { header: "Game", accessor: "game_id" as keyof Campaign },
    { header: "Name", accessor: "name" as keyof Campaign },
    { header: "Description", accessor: "description" as keyof Campaign },
    { header: "Start Date", accessor: "start_date" as keyof Campaign },
    { header: "End Date", accessor: "end_date" as keyof Campaign },
  ];

  const userColumns = [
    { header: "ID", accessor: "id" as keyof User },
    { header: "Organization", accessor: "organization_id" as keyof User },
    { header: "Role", accessor: "role" as keyof User },
    { header: "Name", accessor: "full_name" as keyof User },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Database Dashboard</h1>
      
      <Tabs defaultValue="organizations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
              <CardDescription>Manage your organizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <OrganizationForm onSuccess={fetchData} />
              <DataTable 
                data={organizations} 
                columns={organizationColumns} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games">
          <Card>
            <CardHeader>
              <CardTitle>Games</CardTitle>
              <CardDescription>Manage your games</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <GameForm onSuccess={fetchData} />
              <DataTable 
                data={games} 
                columns={gameColumns} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>Manage your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <CampaignForm onSuccess={fetchData} />
              <DataTable 
                data={campaigns} 
                columns={campaignColumns} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage your team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserForm onSuccess={fetchData} />
              <DataTable 
                data={users} 
                columns={userColumns} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 