import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Company, CompanyDialogState } from '@/types/company';
import { create } from 'zustand';
import { useCompanyStore } from '@/store/companyStore';

export const useCompanyDialogStore = create<CompanyDialogState>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: Company) => set(() => ({ data, isOpen: true })),
}));

type EditCompanyDialogProps = Readonly<
  Pick<CompanyDialogState, 'isOpen' | 'data' | 'toggleModal'>
>;

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface FormData {
  name: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  isActive: boolean;
  employees: Employee[];
}

const initialFormData: FormData = {
  name: '',
  registrationNumber: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: '',
  },
  contactInfo: {
    phone: '',
    email: '',
  },
  isActive: true,
  employees: [],
};

export function EditCompanyDialog({
  isOpen,
  data,
  toggleModal,
}: EditCompanyDialogProps) {
  const { addCompany, updateCompany } = useCompanyStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        registrationNumber: data.registrationNumber || '',
        address: {
          street: data.address?.street || '',
          city: data.address?.city || '',
          postalCode: data.address?.postalCode || '',
          country: data.address?.country || '',
        },
        contactInfo: {
          phone: data.contactInfo?.phoneNumber || '',
          email: data.contactInfo?.email || '',
        },
        isActive: data.isActive ?? true,
        employees: [...(data.employees || [])],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data?.id) {
      await updateCompany({
        ...formData,
        id: data.id,
      } as Company);
    } else {
      await addCompany(formData);
    }

    toggleModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as Record<string, unknown>),
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Modifier l'entreprise" : 'Créer une entreprise'}
          </DialogTitle>
          <DialogDescription>
            {data
              ? "Modifiez les informations de l'entreprise."
              : 'Ajoutez une nouvelle entreprise.'}
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
              <Label htmlFor="registrationNumber" className="text-right">
                N° SIRET
              </Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
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
              <Label htmlFor="contactInfo.phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="contactInfo.phone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
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
            <Button type="submit">{data ? 'Mettre à jour' : 'Créer'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
