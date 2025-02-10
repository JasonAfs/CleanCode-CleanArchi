import { create } from 'zustand';
import { HttpSparePartService } from '@/services/sparePart/HttpSparePartService';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';
import { UserRole } from '@domain/enums/UserRole';

interface SparePartStore {
  spareParts: SparePart[];
  currentSparePart: SparePart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSpareParts: (params?: {
    category?: SparePartCategory;
    manufacturer?: string;
    compatibleModel?: MotorcycleModel;
    userRole?: UserRole;
  }) => Promise<void>;
  fetchSparePartByReference: (reference: string) => Promise<void>;
  createSparePart: (params: {
    reference: string;
    name: string;
    category: SparePartCategory;
    description: string;
    manufacturer: string;
    compatibleModels: MotorcycleModel[];
    minimumThreshold: number;
    unitPrice: number;
    userRole: UserRole;
  }) => Promise<void>;
  updateSparePart: (
    reference: string,
    params: {
      name?: string;
      category?: SparePartCategory;
      description?: string;
      manufacturer?: string;
      compatibleModels?: MotorcycleModel[];
      minimumThreshold?: number;
      unitPrice?: number;
      userRole: UserRole;
    },
  ) => Promise<void>;
  deleteSparePart: (reference: string, userRole: UserRole) => Promise<void>;
}

const sparePartService = new HttpSparePartService();

export const useSparePartStore = create<SparePartStore>((set) => ({
  spareParts: [],
  currentSparePart: null,
  isLoading: false,
  error: null,

  fetchSpareParts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const spareParts = await sparePartService.getSpareParts(params);
      set({ spareParts, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  fetchSparePartByReference: async (reference) => {
    set({ isLoading: true, error: null });
    try {
      const sparePart =
        await sparePartService.getSparePartByReference(reference);
      set({ currentSparePart: sparePart, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  createSparePart: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const newSparePart = await sparePartService.createSparePart(params);
      set((state) => ({
        spareParts: [...state.spareParts, newSparePart],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  updateSparePart: async (reference, params) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSparePart = await sparePartService.updateSparePart(
        reference,
        params,
      );
      set((state) => ({
        spareParts: state.spareParts.map((sp) =>
          sp.reference === reference ? updatedSparePart : sp,
        ),
        currentSparePart: updatedSparePart,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  deleteSparePart: async (reference, userRole) => {
    set({ isLoading: true, error: null });
    try {
      await sparePartService.deleteSparePart(reference, userRole);
      set((state) => ({
        spareParts: state.spareParts.filter((sp) => sp.reference !== reference),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },
}));
