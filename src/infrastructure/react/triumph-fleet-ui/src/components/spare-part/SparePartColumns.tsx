import { ColumnDef } from '@tanstack/react-table';
import { SparePart } from '@/services/sparePart/HttpSparePartService';
import { ActionCell } from './SparePartActionCell';

export const columns: ColumnDef<SparePart>[] = [
  {
    accessorKey: 'reference',
    header: 'Référence',
  },
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
  },
  {
    accessorKey: 'manufacturer',
    header: 'Fabricant',
  },
  {
    accessorKey: 'minimumThreshold',
    header: 'Seuil Minimum',
  },
  {
    accessorKey: 'unitPrice',
    header: 'Prix Unitaire',
    cell: ({ row }) => (
      <span>
        {new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(row.original.unitPrice)}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
