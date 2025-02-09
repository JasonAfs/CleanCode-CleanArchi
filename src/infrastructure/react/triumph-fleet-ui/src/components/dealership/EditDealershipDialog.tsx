// src/components/dealership/EditDealershipDialog.tsx
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
import { create } from "zustand";
import { useDealershipStore } from "@/store/dealershipStore";
import { Dealership, DealershipDialogState } from "@/types/dealership";

export const useDealershipDialogStore = create<DealershipDialogState>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: Dealership) => set(() => ({ data, isOpen: true })),
}));

interface EditDealershipDialogProps {
  readonly isOpen: boolean;
  readonly data: Dealership | null;
  readonly toggleModal: () => void;
}

type DealershipFormData = {
  name: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contactInfo: {
    phoneNumber: string;
    email: string;
  };
  isActive: boolean;
};

const initialFormData: DealershipFormData = {
  name: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  },
  contactInfo: {
    phoneNumber: '',
    email: ''
  },
  isActive: true
};

export function EditDealershipDialog({ isOpen, data, toggleModal }: EditDealershipDialogProps) {
  const { addDealership, updateDealership } = useDealershipStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<DealershipFormData>(initialFormData);

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData(initialFormData);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (data?.id) {
        await updateDealership({
          id: data.id,
          ...formData,
        });
      } else {
        await addDealership(formData);
      }
      
      toggleModal();
    } catch (error) {
      console.error('Failed to save dealership:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNestedChange = (
    section: 'address' | 'contactInfo',
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      if (section === 'address' || section === 'contactInfo') {
        handleNestedChange(section, field, value);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Modifier la concession" : "Créer une concession"}
          </DialogTitle>
          <DialogDescription>
            {data ? "Modifiez les informations de la concession." : "Ajoutez une nouvelle concession."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.street" className="text-right">
                Rue
              </Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.city" className="text-right">
                Ville
              </Label>
              <Input
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.postalCode" className="text-right">
                Code Postal
              </Label>
              <Input
                id="address.postalCode"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.country" className="text-right">
                Pays
              </Label>
              <Input
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactInfo.phoneNumber" className="text-right">
                Téléphone
              </Label>
              <Input
                id="contactInfo.phoneNumber"
                name="contactInfo.phoneNumber"
                value={formData.contactInfo.phoneNumber}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactInfo.email" className="text-right">
                Email
              </Label>
              <Input
                id="contactInfo.email"
                name="contactInfo.email"
                type="email"
                value={formData.contactInfo.email}
                onChange={handleChange}
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