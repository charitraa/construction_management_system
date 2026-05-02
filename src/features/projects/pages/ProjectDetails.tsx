import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Briefcase,
  Edit2,
  Trash2
} from "lucide-react";
import { useGetProject, useUpdateProject, useDeleteProject, useProjectStats } from "../index";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: projectData, isLoading: projectLoading } = useGetProject(id || "");
  const { data: statsData } = useProjectStats();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const project = projectData?.data;
  const stats = statsData?.data;

  const handleMarkAsCompleted = () => {
    if (!id) return;
    updateProject.mutate({
      id,
      data: { status: "completed" },
    });
  };

  const handleDeleteProject = () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject.mutate(id, {
        onSuccess: () => {
          navigate("/projects");
        },
      });
    }
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
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "delayed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
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

  if (projectLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading project details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Project not found</h3>
            <p className="text-gray-500 mb-4">The project you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/projects")}>
              Back to Projects
            </Button>
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
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/projects")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {project.name}
              </h1>
              <p className="text-gray-500 mt-1">Project details and information</p>
            </div>
          </div>
          <div className="flex gap-3">
            {project.status !== "completed" && (
              <Button
                onClick={handleMarkAsCompleted}
                className="bg-green-600 hover:bg-green-700 gap-2"
                disabled={updateProject.isPending}
              >
                <CheckCircle className="w-4 h-4" />
                {updateProject.isPending ? "Updating..." : "Mark as Completed"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(`/projects/edit/${project.id}`)}
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteProject}
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              disabled={deleteProject.isPending}
            >
              <Trash2 className="w-4 h-4" />
              {deleteProject.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Status</h3>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
              {getStatusIcon(project.status)}
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
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
          </div>
        </div>

        {/* Project Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="text-sm font-medium text-gray-900">{project.client_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{project.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(project.start_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-lg font-bold text-indigo-600">
                    ₹{(project.budget / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-gray-500">
                    ₹{project.budget.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {project.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Project Stats Comparison */}
        {stats && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.ongoing}</p>
                <p className="text-sm text-gray-600">Ongoing</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.by_status.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.by_status.delayed || 0}</p>
                <p className="text-sm text-gray-600">Delayed</p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Metadata</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(project.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(project.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}