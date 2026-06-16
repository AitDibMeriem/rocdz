import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListAccessories, useCreateAccessory, getListAccessoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  price: z.number().int().min(0, "Price is required"),
  stock: z.number().int().min(0),
  imageUrl: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function AccessoriesSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accessories, isLoading } = useListAccessories();
  const createAccessory = useCreateAccessory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      stock: 1,
      imageUrl: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createAccessory.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAccessoriesQueryKey() });
          setModalOpen(false);
          form.reset();
          toast({ title: "Accessory added successfully" });
        },
        onError: (err: any) => {
          toast({
            title: "Error adding accessory",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    // Optimistic delete since there is no delete endpoint provided
    const previous = queryClient.getQueryData<any[]>(getListAccessoriesQueryKey()) || [];
    queryClient.setQueryData(getListAccessoriesQueryKey(), previous.filter(a => a.id !== id));
    toast({ title: "Accessory removed (optimistic)" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Accessories</h2>
        <Button onClick={() => setModalOpen(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Accessory
        </Button>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/50">
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-10 h-10 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-[80px] ml-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-[40px] mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-[80px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : accessories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No accessories found.
                </TableCell>
              </TableRow>
            ) : (
              accessories?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded bg-background border border-border flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-muted-foreground opacity-50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-muted/50">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.stock > 0 ? "secondary" : "destructive"}>
                      {item.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" disabled>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Accessory?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {item.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New Accessory</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form id="accessory-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category *</FormLabel><FormControl><Input {...field} placeholder="e.g. Bag, Mouse..." /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price (DA) *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="stock" render={({ field }) => (
                  <FormItem><FormLabel>Stock *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>
              )} />
            </form>
          </Form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="accessory-form" disabled={createAccessory.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Accessory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
