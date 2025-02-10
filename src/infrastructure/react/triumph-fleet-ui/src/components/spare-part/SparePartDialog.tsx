import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { create } from "zustand";
import { useSparePartStore } from "@/store/sparePartStore";
import { SparePart } from '@/services/sparePart/HttpSparePartService';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { useAuth } from '@/hooks/useAuth';

interface SparePartDialogState {
  isOpen: boolean;
  toggleModal: () => void;
  data: SparePart | null;
  setData: (data: SparePart) => void;
}

export const useSparePartDialogStore = create<SparePartDialogState>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: SparePart) => set(() => ({ data, isOpen: true })),
}));

export function SparePartDialog() {
  const { isOpen, data, toggleModal } = useSparePartDialogStore();
  const { createSparePart, updateSparePart } = useSparePartStore();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    reference: '',
    name: '',
    category: SparePartCategory.OTHER,
    description: '',
    manufacturer: '',
    compatibleModels: [],
    minimumThreshold: 0,
    unitPrice: 0,
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (data) {
        await updateSparePart(data.reference, { ...formData, userRole: user.role });
      } else {
        await createSparePart({ ...formData, userRole: user.role });
      }
      toggleModal();
    } catch (error) {
      console.error('Failed to save spare part:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Modifier la pièce" : "Ajouter une pièce"}
          </DialogTitle>
          <DialogDescription>
            {data ? "Modifiez les informations de la pièce." : "Ajoutez une nouvelle pièce."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">Référence</Label>
              <Input
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as SparePartCategory })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SparePartCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manufacturer" className="text-right">Fabricant</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minimumThreshold" className="text-right">Seuil Minimum</Label>
              <Input
                id="minimumThreshold"
                name="minimumThreshold"
                type="number"
                value={formData.minimumThreshold}
                onChange={(e) => setFormData({ ...formData, minimumThreshold: parseInt(e.target.value) })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitPrice" className="text-right">Prix Unitaire</Label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {data ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 