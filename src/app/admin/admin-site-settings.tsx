
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getBannerSettings, updateBannerSettings } from '@/lib/api';
import type { BannerSettings } from '@/lib/types';

export function AdminSiteSettings() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: settings, isLoading, isError } = useQuery<BannerSettings>({
        queryKey: ['bannerSettings'],
        queryFn: getBannerSettings,
    });

    const { mutate: updateSettingsMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateBannerSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bannerSettings'] });
            toast({ title: 'Success', description: 'Settings updated.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: 'Could not update settings.', variant: 'destructive' });
        }
    });

    const handleToggle = (key: keyof BannerSettings) => {
        if (settings) {
            updateSettingsMutation({ [key]: !settings[key] });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }
    
    if (isError) {
        return <p className="text-destructive">Error loading settings.</p>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Manage global settings for your website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Promotional Banners</CardTitle>
                        <CardDescription>Control the visibility of seasonal promotional banners sitewide.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                                <Label htmlFor="halloween-banner" className="font-medium">Halloween Banner</Label>
                                <p className="text-sm text-muted-foreground">Display the Halloween promotion banner under the header.</p>
                            </div>
                            <Switch
                                id="halloween-banner"
                                checked={settings?.showHalloweenBanner}
                                onCheckedChange={() => handleToggle('showHalloweenBanner')}
                                disabled={isUpdating}
                            />
                        </div>
                         <div className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                                <Label htmlFor="christmas-banner" className="font-medium">Christmas Banner</Label>
                                <p className="text-sm text-muted-foreground">Display the Christmas promotion banner under the header.</p>
                            </div>
                            <Switch
                                id="christmas-banner"
                                checked={settings?.showChristmasBanner}
                                onCheckedChange={() => handleToggle('showChristmasBanner')}
                                disabled={isUpdating}
                            />
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}
