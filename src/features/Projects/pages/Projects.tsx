import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useData } from "@/context/DataContext";
import { exportToCSV } from "@/lib/exportUtils";

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterLocation, setFilterLocation] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    location: "",
    contractValue: 0,
  });

  const handleOpenDialog = (projectId?: string) => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setFormData({
          name: project.name,
          clientName: project.clientName,
          location: project.location,
          contractValue: project.contractValue,
        });
        setEditingId(projectId);
      }
    } else {
      setFormData({
        name: "",
        clientName: "",
        location: "",
        contractValue: 0,
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.clientName || !formData.location || formData.contractValue === 0) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      updateProject(editingId, {
        name: formData.name,
        clientName: formData.clientName,
        location: formData.location,
        contractValue: formData.contractValue,
      });
    } else {
      addProject({
        name: formData.name,
        clientName: formData.clientName,
        location: formData.location,
        contractValue: formData.contractValue,
      });
    }

    setOpenDialog(false);
    setFormData({
      name: "",
      clientName: "",
      location: "",
      contractValue: 0,
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const handleExportProjects = () => {
    const dataToExport = filterLocation
      ? projects.filter(proj => proj.location.toLowerCase().includes(filterLocation.toLowerCase()))
      : projects;

    if (dataToExport.length === 0) {
      alert("No projects to export");
      return;
    }

    const columns = ["Project ID", "Project Name", "Client", "Location", "Value (₹)"];
    const rows = dataToExport.map(proj => [
      proj.id,
      proj.name,
      proj.clientName,
      proj.location,
      proj.contractValue,
    ]);

    const filename = `projects_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(filename, columns, rows);
    setShowExportModal(false);
    setFilterLocation("");
  };

  const totalValue = projects.reduce((sum, project) => sum + project.contractValue, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Project Value</p>
            <p className="text-3xl font-bold text-gray-900">₹{(totalValue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 mt-2">{projects.length} projects</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Active Projects</p>
            <p className="text-3xl font-bold text-green-600">{projects.length}</p>
            <p className="text-xs text-gray-500 mt-2">Total</p>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <p className="text-sm font-medium text-blue-700 mb-2">Avg Project Value</p>
            <p className="text-3xl font-bold text-blue-900">
              ₹{projects.length > 0 ? (totalValue / projects.length / 100000).toFixed(1) : 0}L
            </p>
            <p className="text-xs text-blue-600 mt-2">Per project</p>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Project ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Project Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-blue-600 font-semibold">
                      {project.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {project.clientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {project.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                      ₹{(project.contractValue / 100000).toFixed(1)}L
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDialog(project.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <Input
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Value (₹)
              </label>
              <Input
                type="number"
                value={formData.contractValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractValue: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Projects</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Location (Optional)
                </label>
                <Input
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  placeholder="Enter location to filter"
                />
              </div>

              <p className="text-sm text-gray-600">
                {filterLocation
                  ? `${projects.filter(p => p.location.toLowerCase().includes(filterLocation.toLowerCase())).length} project(s) found`
                  : `Total projects: ${projects.length}`}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowExportModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExportProjects}
                className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
