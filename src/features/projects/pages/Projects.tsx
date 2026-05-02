import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  MapPin,
  Briefcase
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useListProjects, useCreateProject, useProjectStats } from "../index";

export default function Projects() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "completed" | "delayed">("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: projectsData, isLoading: projectsLoading } = useListProjects();
  const { data: statsData } = useProjectStats();
  const createProject = useCreateProject();

  const projects = projectsData?.data || [];
  const stats = statsData?.data;

  const [formData, setFormData] = useState({
    name: "",
    client_name: "",
    location: "",
    description: "",
    start_date: "",
    status: "ongoing" as "ongoing" | "completed" | "delayed",
    budget: 0,
  });

  // Filter projects based on search and status
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.client_name && project.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    return filtered;
  }, [projects, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (projectId?: string) => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setFormData({
          name: project.name,
          client_name: project.client_name || "",
          location: project.location || "",
          description: project.description || "",
          start_date: project.start_date,
          status: project.status,
          budget: project.budget,
        });
        setEditingId(projectId);
      }
    } else {
      setFormData({
        name: "",
        client_name: "",
        location: "",
        description: "",
        start_date: "",
        status: "ongoing",
        budget: 0,
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.client_name ||
      !formData.location ||
      !formData.description ||
      !formData.start_date ||
      formData.budget === 0
    ) {
      alert("Please fill all required fields");
      return;
    }

    createProject.mutate({
      name: formData.name,
      client_name: formData.client_name,
      location: formData.location,
      description: formData.description,
      start_date: formData.start_date,
      status: formData.status,
      budget: formData.budget,
    });

    setOpenDialog(false);
    setFormData({
      name: "",
      client_name: "",
      location: "",
      description: "",
      start_date: "",
      status: "ongoing",
      budget: 0,
    });
    setEditingId(null);
  };

  const handleDeleteProject = (projectId: string) => {
    alert("Delete functionality will be implemented when API is ready");
    setShowDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "delayed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Clock className="w-3 h-3" />;
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      case "delayed":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Calculate project progress (mock calculation based on dates)
  const getProjectProgress = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const totalDuration = 365; // Assume 1 year project duration
    const elapsed = Math.max(0, Math.min(totalDuration, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))));
    const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
    return progress;
  };

  if (projectsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projects</h1>
            <p className="text-gray-500 mt-1">Manage and track all construction projects</p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            disabled={createProject.isPending}
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                All projects
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ongoing</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.ongoing}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                In progress
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Successfully delivered
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Delayed</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.delayed}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Need attention
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by project name, client, or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as typeof statusFilter);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>

            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {paginatedProjects.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first project"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  {/* Project Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDialog(project.id)}
                          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-indigo-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Project Details */}
                  <div className="p-5 space-y-3 bg-gray-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Client</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {project.client_name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Location</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {project.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Start Date</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(project.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span>Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${getProjectProgress(project.start_date)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {getProjectProgress(project.start_date)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>Budget</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">
                          ₹{(project.budget / 100000).toFixed(1)}L
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{project.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 ${currentPage === pageNum ? "bg-indigo-600" : ""}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Project Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingId ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Enter client name"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter project location"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "ongoing" | "completed" | "delayed",
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (₹) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter budget amount"
                className="border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Approximately ₹{(formData.budget / 100000).toFixed(1)} Lakhs
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={createProject.isPending}
            >
              {createProject.isPending ? "Saving..." : editingId ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Project</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this project? This action cannot be undone and all associated data will be permanently removed.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}