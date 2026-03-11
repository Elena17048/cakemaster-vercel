'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminCourses } from './admin-courses';
import { AdminGallery } from './admin-gallery';
import { AdminCategories } from './admin-categories';
import { AdminSiteSettings } from './admin-site-settings';
import { AdminWeddings } from './admin-weddings';
import { AdminCorporate } from './admin-corporate';
import { AdminOrders } from './admin-orders';

export default function AdminPage() {

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button onClick={handleLogout} variant="outline">
          Log Out
        </Button>
      </div>

      <p className="mb-8">Admin panel</p>

      <Tabs defaultValue="orders">

        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="orders">Manage Orders</TabsTrigger>
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
          <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
          <TabsTrigger value="weddings">Manage Weddings</TabsTrigger>
          <TabsTrigger value="corporate">Manage Corporate</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <AdminOrders />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <AdminCourses />
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <AdminGallery />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <AdminCategories />
        </TabsContent>

        <TabsContent value="weddings" className="mt-6">
          <AdminWeddings />
        </TabsContent>

        <TabsContent value="corporate" className="mt-6">
          <AdminCorporate />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <AdminSiteSettings />
        </TabsContent>

      </Tabs>

    </div>
  );
}