import React from 'react';
import { useSparePartOrderStore } from '@/store/sparePartOrderStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const SparePartOrderValidation: React.FC = () => {
  const { orders, fetchOrderHistory, validateOrder, isLoading, error } =
    useSparePartOrderStore();

  React.useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const handleValidate = async (orderId: string, action: 'CONFIRM' | 'CANCEL') => {
    try {
      await validateOrder(orderId, action);
    } catch (error) {
      console.error('Error validating order:', error);
    }
  };

  const pendingOrders = orders.filter(
    (order) => order.status === 'PENDING',
  );

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Validation des Commandes</h1>
      
      {pendingOrders.length === 0 ? (
        <p>Aucune commande en attente de validation</p>
      ) : (
        <div className="grid gap-4">
          {pendingOrders.map((order) => (
            <Card key={order.orderId}>
              <CardHeader>
                <CardTitle>Commande #{order.orderId}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>Montant total: {order.totalAmount}€</p>
                  <div className="mt-2">
                    <h4 className="font-semibold">Articles:</h4>
                    <ul className="list-disc pl-4">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - {item.quantity} x {item.unitPrice}€
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleValidate(order.orderId, 'CONFIRM')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirmer
                    </Button>
                    <Button
                      onClick={() => handleValidate(order.orderId, 'CANCEL')}
                      variant="destructive"
                    >
                      Refuser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 