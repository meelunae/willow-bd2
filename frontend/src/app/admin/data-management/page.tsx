'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import AlbumManagement from './components/AlbumManagement';
import TrackManagement from './components/TrackManagement';
import Navbar from '@/app/components/Navbar';

export default function DataManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a26] to-[#1e4b60] text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Data Management</h1>
          <Tabs defaultValue="albums" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
            </TabsList>
            <TabsContent value="albums">
              <AlbumManagement />
            </TabsContent>
            <TabsContent value="tracks">
              <TrackManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 