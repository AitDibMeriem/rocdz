import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListLaptops, useCreateLaptop, useUpdateLaptop, useDeleteLaptop, getListLaptopsQueryKey, getGetLaptopStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Laptop, Star, X as XIcon, ImagePlus } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { ColorSwatchPicker } from "@/components/ColorSwatchPicker";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
};

const formSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  title: z.string().min(1, "Le titre est requis"),
  sku: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  processor: z.string().optional(),
  processorSpeedMin: z.string().optional(),
  processorSpeedMax: z.string().optional(),
  cores: z.number().int().positive().optional(),
  threads: z.number().int().positive().optional(),
  ram: z.number().int().positive().optional(),
  ramType: z.string().optional(),
  storage: z.number().int().positive().optional(),
  storageType: z.string().optional(),
  gpu: z.string().optional(),
  operatingSystem: z.string().optional(),
  screenSize: z.string().optional(),
  screenResolution: z.string().optional(),
  touchscreen: z.boolean().optional(),
  batteryEstimation: z.string().optional(),
  weight: z.string().optional(),
  condition: z.enum(["new", "refurbished"]),
  conditionScore: z.number().int().min(1).max(10).optional(),
  conditionDescription: z.string().optional(),
  warrantyMonths: z.number().int().positive().optional(),
  price: z.number().int().min(0, "Price is required"),
  advance: z.number().int().min(0).optional(),
  stockQuantity: z.number().int().min(0),
  featured: z.boolean().optional(),
  imageUrl: z.string().optional(),
  salePrice: z.number().int().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function LaptopsSection() {
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLaptopId, setEditingLaptopId] = useState<string | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: laptops, isLoading } = useListLaptops();
  const createLaptop = useCreateLaptop();
  const updateLaptop = useUpdateLaptop();
  const deleteLaptop = useDeleteLaptop();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      title: "",
      sku: "",
      color: "",
      description: "",
      processor: "",
      processorSpeedMin: "",
      processorSpeedMax: "",
      cores: undefined,
      threads: undefined,
      ram: undefined,
      ramType: "",
      storage: undefined,
      storageType: "",
      gpu: "",
      operatingSystem: "",
      screenSize: "",
      screenResolution: "",
      touchscreen: false,
      batteryEstimation: "",
      weight: "",
      condition: "new",
      conditionScore: undefined,
      conditionDescription: "",
      warrantyMonths: 12,
      price: 0,
      advance: 0,
      stockQuantity: 1,
      featured: false,
      imageUrl: "",
      salePrice: undefined,
    },
  });

  const conditionWatch = form.watch("condition");
  const imageUrlWatch = form.watch("imageUrl");

  const openAddModal = () => {
    setEditingLaptopId(null);
    form.reset();
    setMediaUrls([]);
    setModalOpen(true);
  };

  const openEditModal = (laptop: any) => {
    setEditingLaptopId(laptop.id);
    form.reset({
      ...laptop,
      sku: laptop.sku || undefined,
      color: (laptop as any).color || undefined,
      description: laptop.description || undefined,
      processor: laptop.processor || undefined,
      processorSpeedMin: laptop.processorSpeedMin || undefined,
      processorSpeedMax: laptop.processorSpeedMax || undefined,
      cores: laptop.cores || undefined,
      threads: laptop.threads || undefined,
      ram: laptop.ram || undefined,
      ramType: laptop.ramType || undefined,
      storage: laptop.storage || undefined,
      storageType: laptop.storageType || undefined,
      gpu: laptop.gpu || undefined,
      operatingSystem: laptop.operatingSystem || undefined,
      screenSize: laptop.screenSize || undefined,
      screenResolution: laptop.screenResolution || undefined,
      touchscreen: laptop.touchscreen || false,
      batteryEstimation: laptop.batteryEstimation || undefined,
      weight: laptop.weight || undefined,
      conditionScore: laptop.conditionScore || undefined,
      conditionDescription: laptop.conditionDescription || undefined,
      warrantyMonths: laptop.warrantyMonths || undefined,
      imageUrl: laptop.imageUrl || undefined,
      featured: laptop.featured || false,
      advance: laptop.advance || 0,
    });
    setMediaUrls((laptop as any).mediaUrls || []);
    setModalOpen(true);
  };

  const saveMedia = async (laptopId: string) => {
    if (mediaUrls.length > 0) {
      await fetch(`${BASE}/api/laptops/${laptopId}/media`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: mediaUrls }),
      });
    }
  };

  const onSubmit = (data: FormValues) => {
    const action = editingLaptopId
      ? updateLaptop.mutateAsync({ id: editingLaptopId, data }).then(async (res: any) => { await saveMedia(editingLaptopId); return res; })
      : createLaptop.mutateAsync({ data }).then(async (res: any) => { if (res?.id) await saveMedia(res.id); return res; });

    action.then(() => {
      queryClient.invalidateQueries({ queryKey: getListLaptopsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetLaptopStatsQueryKey() });
      setModalOpen(false);
      toast({ title: `Laptop ${editingLaptopId ? 'updated' : 'added'} successfully` });
    }).catch((err) => {
      toast({ title: "Error saving laptop", description: err.message || "An unexpected error occurred", variant: "destructive" });
    });
  };

  const handleDelete = (id: string) => {
    deleteLaptop.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLaptopsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetLaptopStatsQueryKey() });
        toast({ title: "Laptop deleted successfully" });
      },
      onError: (err: any) => {
        toast({
          title: "Error deleting laptop",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    });
  };

  const filteredLaptops = laptops?.filter(laptop => {
    const matchesSearch = (laptop.brand + " " + laptop.model + " " + laptop.title).toLowerCase().includes(search.toLowerCase());
    const matchesCondition = conditionFilter === "all" || laptop.condition === conditionFilter;
    const matchesStock = !inStockOnly || laptop.stockQuantity > 0;
    return matchesSearch && matchesCondition && matchesStock;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Laptop Management</h2>
        <Button onClick={openAddModal} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Laptop
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search laptops..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="refurbished">Refurbished</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2 bg-background border border-input rounded-md px-3 h-10">
          <Checkbox 
            id="inStock" 
            checked={inStockOnly} 
            onCheckedChange={(c) => setInStockOnly(!!c)} 
          />
          <label htmlFor="inStock" className="text-sm font-medium leading-none cursor-pointer">
            In Stock Only
          </label>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/50">
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead>Title & Brand</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-12 h-12 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[200px]" /><Skeleton className="h-4 w-[100px] mt-2" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-[40px] mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredLaptops?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No laptops found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredLaptops?.map((laptop) => (
                <TableRow key={laptop.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="w-12 h-12 rounded bg-background border border-border flex items-center justify-center overflow-hidden">
                      {laptop.imageUrl ? (
                        <img src={laptop.imageUrl} alt={laptop.title} className="w-full h-full object-contain" />
                      ) : (
                        <Laptop className="w-6 h-6 text-muted-foreground opacity-50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {laptop.title}
                      {laptop.featured && <Star className="w-3.5 h-3.5 fill-primary text-primary" />}
                    </div>
                    <div className="text-sm text-muted-foreground">{laptop.brand} • {laptop.model}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {laptop.ram && laptop.storage ? `${laptop.ram}GB RAM • ${laptop.storage}GB ${laptop.storageType || ''}` : <span className="text-muted-foreground italic">No specs</span>}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{laptop.processor}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={laptop.condition === 'new' ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-orange-400 border-orange-400/30 bg-orange-400/10'}>
                      {laptop.condition === 'new' ? 'New' : `Refurbished ${laptop.conditionScore}/10`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatPrice(laptop.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={laptop.stockQuantity > 0 ? "secondary" : "destructive"}>
                      {laptop.stockQuantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditModal(laptop)}>
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
                            <AlertDialogTitle>Delete Laptop?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {laptop.brand} {laptop.title}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(laptop.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
        <DialogContent className="max-w-4xl p-0 gap-0 bg-card border-border flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 pb-4 border-b border-border flex-shrink-0">
            <DialogTitle>{editingLaptopId ? 'Edit Laptop' : 'Add New Laptop'}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            <Form {...form}>
              <form id="laptop-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Informations de base</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="brand" render={({ field }) => (
                      <FormItem><FormLabel>Marque *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Choisir une marque" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["HP", "Dell", "Lenovo", "ASUS", "MSI", "Apple", "Acer", "Samsung", "Toshiba", "Autre"].map(b => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="model" render={({ field }) => (
                      <FormItem><FormLabel>Modèle *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Titre *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="sku" render={({ field }) => (
                      <FormItem><FormLabel>SKU (Optionnel)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} className="min-h-[100px]" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Specs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Technical Specs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="processor" render={({ field }) => (
                      <FormItem><FormLabel>Processor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="processorSpeedMin" render={({ field }) => (
                      <FormItem><FormLabel>Base Speed</FormLabel><FormControl><Input {...field} placeholder="e.g. 2.4 GHz" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="processorSpeedMax" render={({ field }) => (
                      <FormItem><FormLabel>Boost Speed</FormLabel><FormControl><Input {...field} placeholder="e.g. 4.2 GHz" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="cores" render={({ field }) => (
                      <FormItem><FormLabel>Cores</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="threads" render={({ field }) => (
                      <FormItem><FormLabel>Threads</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ram" render={({ field }) => (
                      <FormItem><FormLabel>RAM (GB)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ramType" render={({ field }) => (
                      <FormItem><FormLabel>RAM Type</FormLabel><FormControl><Input {...field} placeholder="e.g. DDR5" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="storage" render={({ field }) => (
                      <FormItem><FormLabel>Storage (GB)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="storageType" render={({ field }) => (
                      <FormItem><FormLabel>Storage Type</FormLabel><FormControl><Input {...field} placeholder="e.g. NVMe SSD" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gpu" render={({ field }) => (
                      <FormItem><FormLabel>GPU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="operatingSystem" render={({ field }) => (
                      <FormItem><FormLabel>OS</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="screenSize" render={({ field }) => (
                      <FormItem><FormLabel>Screen Size</FormLabel><FormControl><Input {...field} placeholder="e.g. 15.6 inch" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="screenResolution" render={({ field }) => (
                      <FormItem><FormLabel>Resolution</FormLabel><FormControl><Input {...field} placeholder="e.g. 1920x1080" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="batteryEstimation" render={({ field }) => (
                      <FormItem><FormLabel>Battery Est.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem><FormLabel>Weight</FormLabel><FormControl><Input {...field} placeholder="e.g. 1.8 kg" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="touchscreen" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Touchscreen</FormLabel></div>
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Condition & Warranty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="condition" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="refurbished">Refurbished</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="warrantyMonths" render={({ field }) => (
                      <FormItem><FormLabel>Warranty (Months)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  
                  {conditionWatch === "refurbished" && (
                    <div className="grid grid-cols-1 gap-4 p-4 border border-orange-500/20 bg-orange-500/5 rounded-md">
                      <FormField control={form.control} name="conditionScore" render={({ field }) => (
                        <FormItem><FormLabel>Condition Score (1-10)</FormLabel><FormControl><Input type="number" min="1" max="10" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="conditionDescription" render={({ field }) => (
                        <FormItem><FormLabel>Condition Details</FormLabel><FormControl><Textarea {...field} placeholder="Describe scratches, dents, battery wear..." /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  )}
                </div>

                {/* Commercial */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Commercial</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem><FormLabel>Prix public (DA) *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="salePrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix promo (DA) <span className="text-xs text-red-400 font-normal">optionnel</span></FormLabel>
                        <FormControl><Input type="number" min="0" placeholder="Laisser vide si pas de promo" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl>
                        <p className="text-xs text-muted-foreground mt-1">Affiché avec badge -% et prix barré</p>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="advance" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Versement requis (DA)</FormLabel>
                        <FormControl><Input type="number" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                        <p className="text-xs text-muted-foreground mt-1">Montant à verser par le client avant livraison</p>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="stockQuantity" render={({ field }) => (
                      <FormItem><FormLabel>Stock *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="featured" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary/30 bg-primary/5 p-4">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Laptop</FormLabel>
                        <p className="text-sm text-muted-foreground mt-1">Set this as the highlighted pick of the day on the homepage.</p>
                      </div>
                    </FormItem>
                  )} />
                </div>

                {/* Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Media</h3>
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Product Image</FormLabel>
                      <FormControl>
                        <ImageUpload value={field.value ?? ""} onChange={field.onChange} label="main product image" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Additional Photos / Videos</p>
                      <span className="text-xs text-muted-foreground">{mediaUrls.length} file{mediaUrls.length !== 1 ? "s" : ""}</span>
                    </div>

                    {mediaUrls.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {mediaUrls.map((url, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-border bg-background aspect-square">
                            {url.match(/\.(mp4|webm|mov)$/i) ? (
                              <video src={url} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-contain p-1" />
                            )}
                            <button
                              type="button"
                              onClick={() => setMediaUrls(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-2 border-dashed border-border rounded-lg p-4">
                      <ImageUpload
                        value=""
                        onChange={(url) => { if (url) setMediaUrls(prev => [...prev, url]); }}
                        label="additional photo or video"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Click the upload above repeatedly to add multiple images or videos to the gallery.</p>
                  </div>
                </div>

                <div className="h-10" /> {/* Bottom padding for scroll */}
              </form>
            </Form>
          </div>
          
          <DialogFooter className="p-4 border-t border-border bg-muted/20 flex-shrink-0">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="laptop-form" disabled={createLaptop.isPending || updateLaptop.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {editingLaptopId ? 'Save Changes' : 'Add Laptop'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
