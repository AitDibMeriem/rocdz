import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListAccessories, useCreateAccessory, getListAccessoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { ColorSwatchPicker } from "@/components/ColorSwatchPicker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const fmt = (p: number) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

const CATEGORIES = ["Keyboards", "Mice", "Headsets", "Monitors", "Controllers", "Bags", "Chargers", "Hubs & Adapters", "Other"];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  color: z.string().optional(),
  description: z.string().optional(),
  price: z.number().int().min(0, "Le prix est requis"),
  salePrice: z.number().int().min(0).optional(),
  stock: z.number().int().min(0),
  imageUrl: z.string().optional(),
  brand: z.string().optional(),
  warranty: z.string().optional(),
  compatibility: z.string().optional(),
  specifications: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function AccessoriesSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accessories, isLoading } = useListAccessories();
  const createAccessory = useCreateAccessory();

  const updateAccessory = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<FormValues> }) => {
      const r = await fetch(`${BASE}/api/accessories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error("Failed to update");
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListAccessoriesQueryKey() });
      setModalOpen(false);
      form.reset();
      setEditingId(null);
      toast({ title: "Accessoire modifié" });
    },
    onError: () => toast({ title: "Erreur lors de la modification", variant: "destructive" }),
  });

  const deleteAccessory = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`${BASE}/api/accessories/${id}`, { method: "DELETE" });
      if (!r.ok && r.status !== 204) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListAccessoriesQueryKey() });
      toast({ title: "Accessoire supprimé" });
    },
    onError: () => toast({ title: "Erreur lors de la suppression", variant: "destructive" }),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", category: "", color: "", description: "", price: 0, salePrice: undefined, stock: 1, imageUrl: "", brand: "", warranty: "", compatibility: "", specifications: "" },
  });

  const openAdd = () => {
    setEditingId(null);
    form.reset({ name: "", category: "", color: "", description: "", price: 0, salePrice: undefined, stock: 1, imageUrl: "", brand: "", warranty: "", compatibility: "", specifications: "" });
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      name: item.name,
      category: item.category,
      color: item.color || "",
      description: item.description || "",
      price: item.price,
      salePrice: item.salePrice ?? undefined,
      stock: item.stock,
      imageUrl: item.imageUrl || "",
      brand: item.brand || "",
      warranty: item.warranty || "",
      compatibility: item.compatibility || "",
      specifications: item.specifications || "",
    });
    setModalOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    if (editingId) {
      updateAccessory.mutate({ id: editingId, data });
    } else {
      createAccessory.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAccessoriesQueryKey() });
          setModalOpen(false);
          form.reset();
          toast({ title: "Accessoire ajouté" });
        },
        onError: (err: any) => toast({ title: "Erreur lors de l'ajout", description: err.message, variant: "destructive" }),
      });
    }
  };

  const isPending = createAccessory.isPending || updateAccessory.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accessoires</h2>
          <p className="text-muted-foreground text-sm mt-1">{accessories?.length ?? 0} articles</p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Ajouter un accessoire
        </Button>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/50">
              <TableHead className="w-[60px]">Photo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Couleur</TableHead>
              <TableHead className="text-right">Prix</TableHead>
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
                  <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-[80px] ml-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-[40px] mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-[80px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : accessories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Aucun accessoire. Ajoutez-en un !
                </TableCell>
              </TableRow>
            ) : (
              accessories?.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-muted-foreground opacity-50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-muted/50">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{(item as any).color || "—"}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{fmt(item.price)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.stock > 0 ? "secondary" : "destructive"}>{item.stock}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(item)}>
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
                            <AlertDialogTitle>Supprimer "{item.name}" ?</AlertDialogTitle>
                            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteAccessory.mutate(item.id)} className="bg-destructive text-destructive-foreground">
                              Supprimer
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

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditingId(null); form.reset(); } else setModalOpen(true); }}>
        <DialogContent className="max-w-xl bg-card border-border flex flex-col max-h-[90vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{editingId ? "Modifier l'accessoire" : "Ajouter un accessoire"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            <Form {...form}>
              <form id="accessory-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nom *</FormLabel><FormControl><Input {...field} className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Catégorie *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Choisir..." /></SelectTrigger></FormControl>
                        <SelectContent>
                          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="color" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur</FormLabel>
                    <FormControl>
                      <ColorSwatchPicker value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} className="bg-background" /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Prix (DA) *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="salePrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix promo (DA) <span className="text-xs text-red-400 font-normal">opt.</span></FormLabel>
                      <FormControl><Input type="number" min="0" placeholder="Promo" className="bg-background" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem><FormLabel>Stock *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem><FormLabel>Marque</FormLabel><FormControl><Input {...field} placeholder="ex: Logitech" className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="warranty" render={({ field }) => (
                    <FormItem><FormLabel>Garantie</FormLabel><FormControl><Input {...field} placeholder="ex: 1 an" className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="compatibility" render={({ field }) => (
                    <FormItem><FormLabel>Compatibilité</FormLabel><FormControl><Input {...field} placeholder="ex: Windows / Mac" className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="specifications" render={({ field }) => (
                  <FormItem><FormLabel>Spécifications techniques</FormLabel><FormControl><Textarea {...field} placeholder="DPI max, connectivité, poids..." className="bg-background" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image du produit</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value ?? ""} onChange={field.onChange} label="product image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </form>
            </Form>
          </div>
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => { setModalOpen(false); setEditingId(null); form.reset(); }}>Annuler</Button>
            <Button type="submit" form="accessory-form" disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isPending ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
