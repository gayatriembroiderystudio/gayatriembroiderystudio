import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Star, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
  });

  const services = data?.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Service deleted");

    qc.invalidateQueries({
      queryKey: ["services"],
    });
  }

  async function toggleFeatured(id: string, value: boolean) {
    const { error } = await supabase
      .from("services")
      .update({
        featured: !value,
      })
      .eq("id", id);

    if (!error)
      qc.invalidateQueries({
        queryKey: ["services"],
      });
  }

  async function toggleStatus(id: string, value: boolean) {
    const { error } = await supabase
      .from("services")
      .update({
        status: !value,
      })
      .eq("id", id);

    if (!error)
      qc.invalidateQueries({
        queryKey: ["services"],
      });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-maroon-deep">Services</h1>

          <p className="text-muted-foreground">Manage your embroidery services.</p>
        </div>

        <Link
          to="/admin/service-add"
          className="inline-flex items-center gap-2 rounded-lg bg-maroon px-5 py-2.5 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <input
          placeholder="Search service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border pl-10 pr-4 py-2"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full table-fixed">
          <thead className="bg-muted">
            <tr>
              <th className="w-28 p-4 text-left">Image</th>
              <th className="text-left">Name</th>
              <th className="w-36 text-center">Price</th>
              <th className="w-28 text-center">Featured</th>
              <th className="w-28 text-center">Status</th>
              <th className="w-36 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t align-middle">
                <td className="p-4">
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                </td>

                <td className="font-medium text-maroon-deep">{service.name}</td>

                <td className="text-center">{service.price || "-"}</td>

                <td className="text-center">
                  <button onClick={() => toggleFeatured(service.id, service.featured)}>
                    <Star
                      className={`mx-auto h-5 w-5 ${
                        service.featured ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                      }`}
                    />
                  </button>
                </td>

                <td className="text-center">
                  <button onClick={() => toggleStatus(service.id, service.status)}>
                    {service.status ? (
                      <Eye className="mx-auto h-5 w-5 text-green-600" />
                    ) : (
                      <EyeOff className="mx-auto h-5 w-5 text-red-600" />
                    )}
                  </button>
                </td>

                <td>
                  <div className="flex justify-center gap-3">
                    <Link to="/admin/service-edit/$id" params={{ id: service.id }}>
                      <Pencil className="h-5 w-5 text-blue-600" />
                    </Link>

                    <button onClick={() => deleteService(service.id)}>
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
