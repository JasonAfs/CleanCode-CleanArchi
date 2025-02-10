import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useSparePartOrderStore } from '@/store/sparePartOrderStore';

export function NewOrderDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { createOrder } = useSparePartOrderStore();
  const [items, setItems] = useState([{ sparePartReference: '', quantity: 1 }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reference = items[0].sparePartReference.trim();
    
    if (!reference) {
      console.error('La référence est requise');
      return;
    }

    const orderData = {
      items: [{
        sparePartReference: reference,
        quantity: items[0].quantity
      }]
    };

    console.log('Frontend - Submitting order:', orderData);

    try {
      await createOrder(orderData);
      setIsOpen(false);
      setItems([{ sparePartReference: '', quantity: 1 }]);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle commande
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle commande</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Référence de la pièce</Label>
            <Input
              value={items[0].sparePartReference}
              onChange={(e) => {
                setItems([{
                  ...items[0],
                  sparePartReference: e.target.value
                }]);
              }}
              placeholder="Entrez la référence"
              required
            />
            <Label>Quantité</Label>
            <Input
              type="number"
              min="1"
              value={items[0].quantity}
              onChange={(e) => {
                setItems([{
                  ...items[0],
                  quantity: parseInt(e.target.value) || 1
                }]);
              }}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit">Créer la commande</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 