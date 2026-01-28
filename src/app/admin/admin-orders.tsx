'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrders, updateOrderStatus } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  new: 'bg-gray-400',
  awaiting_payment: 'bg-yellow-500',
  paid: 'bg-green-500',
  done: 'bg-blue-500',
};

export function AdminOrders() {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'cs' ? cs : undefined;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Hotovo',
        description: 'Stav objednávky byl aktualizován.',
      });
    },
    onError: () => {
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se změnit stav objednávky.',
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateStatusMutation({ orderId, status });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-destructive">Chyba při načítání objednávek.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objednávky</CardTitle>
        <CardDescription>
          Přehled a správa všech objednávek
        </CardDescription>
      </CardHeader>

      <CardContent>
        {orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vytvořeno</TableHead>
                <TableHead>Vyzvednutí</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Dort</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => {
                const createdAt =
                  order.createdAt?.toDate?.() ??
                  (order.createdAt ? new Date(order.createdAt as any) : null);

                const pickupDate = order.pickupDate
                  ? new Date(order.pickupDate)
                  : null;

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      {createdAt
                        ? format(createdAt, 'PPP p', { locale })
                        : '—'}
                    </TableCell>

                    <TableCell>
                      {pickupDate
                        ? format(pickupDate, 'PPP', { locale })
                        : '—'}
                    </TableCell>

                    <TableCell>
                      {order.customer ? (
                        <>
                          <div>{order.customer.name}</div>
                          <div className="text-muted-foreground text-sm">
                            {order.customer.email}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {order.customer.phone}
                          </div>
                        </>
                      ) : (
                        <span className="italic text-muted-foreground">
                          bez kontaktu
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary">
                            Velikost: {order.size}
                          </Badge>
                          <Badge variant="secondary">
                            Příchuť: {order.flavor}
                          </Badge>
                          {order.shape && (
                            <Badge variant="secondary">
                              Tvar: {order.shape}
                            </Badge>
                          )}
                        </div>

                        {order.plaqueText && (
                          <p className="text-sm text-muted-foreground italic truncate">
                            „{order.plaqueText}“
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      {order.amount} Kč
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={cn(
                          'text-white capitalize',
                          statusColors[order.status] ?? 'bg-gray-300'
                        )}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.location.href =
                            `/admin/admin-order-detail?id=${order.id}`
                        }
                      >
                        Detail
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Stav
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          {(['new', 'awaiting_payment', 'paid', 'done'] as OrderStatus[]).map(
                            (status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order.id, status);
                                }}
                                disabled={order.status === status}
                              >
                                {status}
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p>Žádné objednávky nebyly nalezeny.</p>
        )}
      </CardContent>
    </Card>
  );
}
