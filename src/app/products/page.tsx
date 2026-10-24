"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  FilePlus,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { formatFCFA } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { ProductsSkeleton } from "@/components/products/ProductsSkeleton";

interface ProductService {
  id: string;
  name: string;
  category: "Conseil & Stratégie" | "Développement Web" | "Design UI/UX" | "Maintenance & Support" | "Formation";
  unitPrice: number;
  taxRate: number; // 18% UEMOA
  unitType: "prestation" | "heure" | "jour" | "mois" | "unite";
  description: string;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductService[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Développement Web" as ProductService["category"],
    unitPrice: 500000,
    taxRate: 18,
    unitType: "prestation" as ProductService["unitType"],
    description: "",
  });

  const categories = [
    "all",
    "Développement Web",
    "Design UI/UX",
    "Conseil & Stratégie",
    "Maintenance & Support",
    "Formation",
  ];

  // Fetch user products from Supabase
  const fetchProducts = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (!error && data) {
        setProducts(
          data.map((row: any) => ({
            id: row.id,
            name: row.name,
            category: row.category,
            unitPrice: Number(row.unit_price) || 0,
            taxRate: Number(row.tax_rate) || 18,
            unitType: row.unit_type || "prestation",
            description: row.description || "",
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData({
      name: "",
      category: "Développement Web",
      unitPrice: 500000,
      taxRate: 18,
      unitType: "prestation",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductService) => {
    setModalMode("edit");
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      unitPrice: p.unitPrice,
      taxRate: p.taxRate,
      unitType: p.unitType,
      description: p.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm("Voulez-vous vraiment supprimer cet article du catalogue ?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await supabase.from("products").delete().eq("id", id).eq("user_id", user.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (modalMode === "create") {
      const newProduct: ProductService = {
        id: `prod_${Date.now()}`,
        name: formData.name,
        category: formData.category,
        unitPrice: Number(formData.unitPrice),
        taxRate: Number(formData.taxRate),
        unitType: formData.unitType,
        description: formData.description,
      };

      setProducts((prev) => [...prev, newProduct]);
      setIsModalOpen(false);

      await supabase.from("products").insert({
        id: newProduct.id,
        user_id: user.id,
        name: newProduct.name,
        category: newProduct.category,
        unit_price: Math.round(newProduct.unitPrice),
        tax_rate: newProduct.taxRate,
        unit_type: newProduct.unitType,
        description: newProduct.description,
      });
    } else if (modalMode === "edit" && editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                unitPrice: Number(formData.unitPrice),
                taxRate: Number(formData.taxRate),
                unitType: formData.unitType,
                description: formData.description,
              }
            : p
        )
      );
      setIsModalOpen(false);

      await supabase
        .from("products")
        .update({
          name: formData.name,
          category: formData.category,
          unit_price: Math.round(Number(formData.unitPrice)),
          tax_rate: Number(formData.taxRate),
          unit_type: formData.unitType,
          description: formData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)
        .eq("user_id", user.id);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
        {/* 1. Desktop Sidebar */}
        <Sidebar currentPath="/products" />

        {/* 2. Main Canvas */}
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0 pb-20 lg:pb-12">
          <MobileHeader />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Breadcrumb */}
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Link href="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                Accueil
              </Link>
              <span>›</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">Catalogue Prestations</span>
            </div>

            {/* Header Banner */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/90 dark:border-slate-700/60 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold mb-2 border border-slate-200 dark:border-slate-600">
                  <Package className="w-3.5 h-3.5" />
                  <span>Catalogue & Grille Tarifaire</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Services & Forfaits en FCFA
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  Enregistrez vos forfaits récurrents et tarifs horaires pour générer vos factures en quelques clics.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Service</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      selectedCategory === cat
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                        : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat === "all" ? "Toutes les catégories" : cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un service..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <ProductsSkeleton />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/90 dark:border-slate-700/60 p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 mx-auto flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {products.length === 0 ? "Votre catalogue est vide" : "Aucun service correspondant"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {products.length === 0
                      ? "Ajoutez vos premiers forfaits ou prestations pour les insérer instantanément dans vos factures."
                      : "Essayez de modifier votre recherche ou de sélectionner une autre catégorie."}
                  </p>
                </div>
                {products.length === 0 && (
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer une prestation</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-card hover:shadow-dropdown hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block">
                          Prix unitaire HT
                        </span>
                        <div className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                          {formatFCFA(p.unitPrice)}
                          <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
                            / {p.unitType}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/invoices/new"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all shadow-2xs group-hover:scale-105"
                        title="Facturer ce service"
                      >
                        <FilePlus className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        <MobileBottomNav currentPath="/products" />

        {/* Modal Create/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {modalMode === "create" ? "Ajouter un service au catalogue" : "Modifier la prestation"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Désignation du service
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Déploiement d'infrastructure Cloud"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as ProductService["category"],
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                    >
                      <option value="Développement Web">Développement Web</option>
                      <option value="Design UI/UX">Design UI/UX</option>
                      <option value="Conseil & Stratégie">Conseil & Stratégie</option>
                      <option value="Maintenance & Support">Maintenance & Support</option>
                      <option value="Formation">Formation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Unité de facturation
                    </label>
                    <select
                      value={formData.unitType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          unitType: e.target.value as ProductService["unitType"],
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                    >
                      <option value="prestation">Par prestation</option>
                      <option value="jour">Par jour (TJM)</option>
                      <option value="heure">Par heure</option>
                      <option value="mois">Par mois (abonnement)</option>
                      <option value="unite">Par unité</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Prix unitaire HT (FCFA)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1000}
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      TVA applicable
                    </label>
                    <input
                      type="number"
                      value={formData.taxRate}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Description détaillée (affichée sur la facture)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Précisez le périmètre de la prestation..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    {modalMode === "create" ? "Ajouter au catalogue" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
