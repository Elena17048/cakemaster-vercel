
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { HalloweenOrderModal } from "./order-modal";
import { Ghost, Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type BoxType = 'box_6' | 'box_12';

const boxDetails = {
    box_6: { price: 540, quantity: 6 },
    box_12: { price: 1050, quantity: 12 },
};

export default function HalloweenPage() {
    const { t } = useTranslation('halloween');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBox, setSelectedBox] = useState<BoxType>('box_6');
    const [quantity, setQuantity] = useState(1);

    const handleOrderClick = () => {
        if (quantity > 0) {
            setIsModalOpen(true);
        }
    };

    const handleOrderSuccess = () => {
        setIsModalOpen(false);
        setQuantity(1);
    };

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const currentBoxDetails = boxDetails[selectedBox];
    const totalPrice = quantity * currentBoxDetails.price;

    const flavors: string[] = Array.isArray(t('description.flavors', { returnObjects: true }))
        ? t('description.flavors', { returnObjects: true }) as string[]
        : [];

    return (
        <>
            <div
                className="relative py-16 md:py-24 bg-background"
                style={{
                    backgroundImage: `url(/assets/web.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="absolute inset-0 bg-black/70" />
                <div className="container relative mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Image */}
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl md:order-1">
                            <Image
                                src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Fhalloween_cp.jpg?alt=media"
                                alt="Halloween Cupcakes"
                                fill
                                className="object-cover"
                                data-ai-hint="halloween cupcakes"
                            />
                        </div>

                        {/* Right Column: Info and Order Form */}
                        <div className="space-y-8 md:order-2">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-headline font-bold text-orange-500">{t('title')}</h1>
                                <p className="mt-4 text-lg text-white/90">{t('description.p1')}</p>
                                <p className="mt-2 text-white/60">{t('description.pickup')}</p>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">{t('description.title')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {flavors.map(flavor => (
                                            <li key={flavor} className="flex items-center gap-3">
                                                <Ghost className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                                <span>{flavor}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/90 backdrop-blur-sm">
                                <CardContent className="pt-6 space-y-6">
                                    {/* Box Size Selection */}
                                    <div>
                                        <Label className="text-lg font-medium font-headline">{t('boxes.selectTitle')}</Label>
                                        <RadioGroup
                                            value={selectedBox}
                                            onValueChange={(value: string) => setSelectedBox(value as BoxType)}
                                            className="mt-2 grid grid-cols-2 gap-4"
                                        >
                                            <div>
                                                <RadioGroupItem value="box_6" id="box_6" className="sr-only" />
                                                <Label htmlFor="box_6" className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${selectedBox === 'box_6' ? 'border-orange-500 bg-accent' : 'border-border'}`}>
                                                    {t('boxes.box_6.title')}
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="box_12" id="box_12" className="sr-only" />
                                                <Label htmlFor="box_12" className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${selectedBox === 'box_12' ? 'border-orange-500 bg-accent' : 'border-border'}`}>
                                                    {t('boxes.box_12.title')}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {/* Quantity and Price */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Label className="font-medium font-headline">{t('form.quantity')}</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="text-lg font-bold w-10 text-center">{quantity}</span>
                                                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">{t('form.total')}</p>
                                            <p className="text-2xl font-bold font-headline">{totalPrice} CZK</p>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        onClick={handleOrderClick}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg transform hover:scale-105 transition-transform duration-300"
                                    >
                                        {t('orderButton.available')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <HalloweenOrderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onOrderSuccess={handleOrderSuccess}
                    order={{
                        boxType: selectedBox,
                        quantity: quantity * currentBoxDetails.quantity,
                        boxCount: quantity,
                        totalPrice: totalPrice
                    }}
                />
            )}
        </>
    );
}
