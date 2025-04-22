
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Supplier, SupplierCategory } from "@/types/supplier";
import { supplierService } from "@/services/supplierService";
import { SupplierDialog } from "@/components/suppliers/SupplierDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Suppliers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch suppliers
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.getAll.bind(supplierService),
  });

  // Create supplier mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => 
      supplierService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating supplier:", error);
      toast.error("Failed to create supplier");
    }
  });

  // Update supplier mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Supplier> }) => 
      supplierService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsDialogOpen(false);
      setEditingSupplier(null);
    },
    onError: (error) => {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier");
    }
  });

  // Delete supplier mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => supplierService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    }
  });

  const handleCreateSupplier = (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    createMutation.mutate(data);
  };

  const handleUpdateSupplier = (data: Partial<Supplier>) => {
    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, data });
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter suppliers based on search term and category
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         supplier.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categories for filtering
  const categories: SupplierCategory[] = [
    "Hardware", "Software", "Logistics", "Manufacturing", 
    "Electronics", "Materials", "Shipping", "Other"
  ];

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Supplier Marketplace</h1>
          <Button onClick={() => {
            setEditingSupplier(null);
            setIsDialogOpen(true);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 animate-pulse bg-muted rounded-md"></div>
            ))}
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <SupplierCard 
                key={supplier.id} 
                {...supplier} 
                onEdit={() => handleEditSupplier(supplier)}
                onDelete={() => handleDeleteSupplier(supplier.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No suppliers found</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Supplier Dialog for Create/Edit */}
      <SupplierDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        supplier={editingSupplier}
        onSubmit={editingSupplier ? handleUpdateSupplier : handleCreateSupplier}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </DashboardLayout>
  );
}
