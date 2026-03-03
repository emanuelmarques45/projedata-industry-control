import { useState } from "react";
import {
  useRawMaterials,
  useCreateRawMaterial,
  useUpdateRawMaterial,
  useDeleteRawMaterial,
} from "@/hooks/rawMaterial";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { RawMaterialForm } from "@/components/RawMaterialForm";
import type { RawMaterial } from "@/types/RawMaterial";
import type { RawMaterialInput } from "@/types/RawMaterialInput";

export function RawMaterialsPage() {
  const { data: rawMaterials, isLoading } = useRawMaterials();
  const createMutation = useCreateRawMaterial();
  const updateMutation = useUpdateRawMaterial();
  const deleteMutation = useDeleteRawMaterial();

  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(
    null,
  );

  function handleSubmit(data: RawMaterialInput) {
    if (editingMaterial) {
      updateMutation.mutate(
        { id: editingMaterial.id, data },
        {
          onSuccess: () => handleCancelEdit(),
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => handleCancelEdit(),
      });
    }
  }

  function handleEdit(material: RawMaterial) {
    setEditingMaterial(material);
  }

  function handleCancelEdit() {
    setEditingMaterial(null);
  }

  function handleDelete(id: number, code: string, name: string) {
    if (
      confirm(
        `You are going to delete raw material ${code} | ${name}. Are you sure?`,
      )
    ) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className='container mx-auto max-w-6xl py-10 space-y-8'>
      <h1 className='text-3xl font-bold tracking-tight'>Raw Materials</h1>

      <RawMaterialForm
        initialData={editingMaterial ?? undefined}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onCancel={editingMaterial ? () => setEditingMaterial(null) : undefined}
      />

      {/* LIST */}
      {isLoading ? (
        <div className='flex justify-center py-10'>
          <Spinner className='size-12' />
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {rawMaterials?.map((rm) => (
            <Card key={rm.id} className='shadow-md'>
              <CardHeader>
                <CardTitle>
                  {rm.name}{" "}
                  <span className='text-gray-400 text-sm'>({rm.code})</span>
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Stock: {rm.stock_quantity}
                </p>
              </CardContent>

              <CardFooter className='flex justify-between'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleEdit(rm)}
                >
                  Edit
                </Button>

                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDelete(rm.id, rm.code, rm.name)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
