'use client';

import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

export default function AdminOrderDetail() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return <p className="p-8">Načítám objednávku…</p>;
  }

  if (!order) {
    return <p className="p-8">Objednávka nebyla nalezena.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
      >
        ← Zpět
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detail objednávky</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div>
            <strong>ID:</strong> {order.id}
          </div>

          <div>
            <strong>Stav:</strong>{' '}
            <Badge className="capitalize">
              {order.status}
            </Badge>
          </div>

          <div>
            <strong>Vytvořeno:</strong>{' '}
            {order.createdAt
              ? format(order.createdAt.toDate(), 'PPP p', { locale: cs })
              : '—'}
          </div>

          <div>
            <strong>Datum vyzvednutí:</strong>{' '}
            {format(new Date(order.pickupDate), 'PPP', { locale: cs })}
          </div>

          <hr />

          <div>
            <strong>Dort:</strong>
            <ul className="list-disc ml-5">
              <li>Příchuť: {order.flavor}</li>
              <li>Velikost: {order.size}</li>
              {order.shape && <li>Tvar: {order.shape}</li>}
            </ul>
          </div>

          {order.plaqueText && (
            <div>
              <strong>Text na dort:</strong>
              <p className="italic">„{order.plaqueText}“</p>
            </div>
          )}

          <hr />

          <div>
            <strong>Cena:</strong> {order.amount} Kč
          </div>

          <hr />

          <div>
            <strong>Zákazník:</strong>
            {order.customer ? (
              <ul className="list-disc ml-5">
                <li>{order.customer.name}</li>
                <li>{order.customer.email}</li>
                <li>{order.customer.phone}</li>
              </ul>
            ) : (
              <p className="italic text-muted-foreground">
                Kontakt zatím nebyl vyplněn
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
