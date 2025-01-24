// src/components/company/EditCompanyDialog.tsx
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
import { Company, CompanyDialogState } from "@/types/company";
import { create } from "zustand";
import { useCompanyStore } from "@/store/companyStore";

export const useCompanyDialogStore = create<CompanyDialogState>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: Company) => set(() => ({ data, isOpen: true })),
}));

type EditCompanyDialogProps = Pick<CompanyDialogState, "isOpen" | "data" | "toggleModal">;

export function EditCompanyDialog({ isOpen, data, toggleModal }: EditCompanyDialogProps) {
  const { addCompany, updateCompany } = useCompanyStore();
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    email: '',
    status: 'active'
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({
        name: '',
        email: '',
        status: 'active'
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (data?.id) {
      // Mise à jour
      updateCompany({
        ...formData,
        id: data.id
      } as Company);
    } else {
      // Création
      addCompany(formData as Omit<Company, 'id'>);
    }
    
    toggleModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Modifier l'entreprise" : "Créer une entreprise"}
          </DialogTitle>
          <DialogDescription>
            {data ? "Modifiez les informations de l'entreprise." : "Ajoutez une nouvelle entreprise."}
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
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
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