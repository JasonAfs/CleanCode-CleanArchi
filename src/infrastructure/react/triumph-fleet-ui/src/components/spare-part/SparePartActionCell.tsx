import { Row } from '@tanstack/react-table';
import { SparePart } from '@/services/sparePart/HttpSparePartService';
import { useAuth } from '@/hooks/useAuth';
import { useSparePartStore } from '@/store/sparePartStore';
import { useSparePartDialogStore } from './SparePartDialog';
import { UserRole } from '@domain/enums/UserRole';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ActionCell = ({ row }: { row: Row<SparePart> }) => {
  const { user } = useAuth();
  const { deleteSparePart } = useSparePartStore();
  const { setData } = useSparePartDialogStore();

  if (user?.role !== UserRole.TRIUMPH_ADMIN) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setData(row.original)}
          className="cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => deleteSparePart(row.original.reference, user.role)}
          className="cursor-pointer text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
