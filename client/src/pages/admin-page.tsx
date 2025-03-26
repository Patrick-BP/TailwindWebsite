import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { AdminTab } from "@/models/types";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  insertProjectSchema, 
  insertBlogPostSchema, 
  insertTimelineEntrySchema,
  insertProfileSchema, 
  Project, 
  BlogPost, 
  TimelineEntry,
  Profile
} from "@shared/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

// Component for managing projects
function ProjectsManagement() {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project created",
        description: "Project has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project updated",
        description: "Project has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      form.reset();
      setIsDialogOpen(false);
      setIsEditMode(false);
      setCurrentProject(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      liveUrl: "",
      githubUrl: "",
      category: "",
      techStack: [] as string[],
      featured: false,
    },
  });

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setIsEditMode(true);
      setCurrentProject(project);
      form.reset({
        title: project.title,
        description: project.description,
        thumbnail: project.thumbnail,
        liveUrl: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        category: project.category,
        techStack: project.techStack,
        featured: project.featured,
      });
    } else {
      setIsEditMode(false);
      setCurrentProject(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    // Convert techStack to array if it's a comma-separated string
    const formattedData = {
      ...data,
      techStack: typeof data.techStack === 'string'
        ? data.techStack.split(',').map((tech: string) => tech.trim())
        : data.techStack,
    };

    if (isEditMode && currentProject) {
      updateProjectMutation.mutate({
        id: currentProject.id,
        data: formattedData,
      });
    } else {
      createProjectMutation.mutate(formattedData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.featured ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete project?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The project will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProjectMutation.mutate(project.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No projects found. Add your first project to get started.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {isEditMode ? "update the" : "create a new"} project.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Project Title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Web App, Mobile, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Detailed description of the project" 
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="URL to the project thumbnail" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://github.com/username/repo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="React, Node.js, MongoDB, etc." 
                        value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter technologies separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Project</FormLabel>
                      <FormDescription>
                        Display this project prominently on your portfolio
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createProjectMutation.isPending || updateProjectMutation.isPending}>
                  {(createProjectMutation.isPending || updateProjectMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditMode ? "Update Project" : "Create Project"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for managing blog posts
function BlogManagement() {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const createBlogPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/blog-posts", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post created",
        description: "Blog post has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/blog-posts/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post updated",
        description: "Blog post has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      form.reset();
      setIsDialogOpen(false);
      setIsEditMode(false);
      setCurrentPost(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Blog post deleted",
        description: "Blog post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
      excerpt: "",
      category: "",
    },
  });

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setIsEditMode(true);
      setCurrentPost(post);
      form.reset({
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail,
        excerpt: post.excerpt,
        category: post.category,
      });
    } else {
      setIsEditMode(false);
      setCurrentPost(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    if (isEditMode && currentPost) {
      updateBlogPostMutation.mutate({
        id: currentPost.id,
        data,
      });
    } else {
      createBlogPostMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Blog Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : blogPosts && blogPosts.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{new Date(post.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete blog post?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The blog post will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBlogPostMutation.mutate(post.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No blog posts found. Add your first blog post to get started.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {isEditMode ? "update the" : "create a new"} blog post.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Blog Post Title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="React, Node.js, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief summary of the blog post" 
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Full content of the blog post (supports markdown)" 
                        rows={10}
                      />
                    </FormControl>
                    <FormDescription>
                      You can use Markdown for formatting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="URL to the blog post thumbnail" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createBlogPostMutation.isPending || updateBlogPostMutation.isPending}>
                  {(createBlogPostMutation.isPending || updateBlogPostMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditMode ? "Update Blog Post" : "Create Blog Post"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for managing timeline entries
function TimelineManagement() {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimelineEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: timelineEntries, isLoading } = useQuery<TimelineEntry[]>({
    queryKey: ["/api/timeline-entries"],
  });

  const createTimelineEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/timeline-entries", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Timeline entry created",
        description: "Timeline entry has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeline-entries"] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create timeline entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTimelineEntryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/timeline-entries/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Timeline entry updated",
        description: "Timeline entry has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeline-entries"] });
      form.reset();
      setIsDialogOpen(false);
      setIsEditMode(false);
      setCurrentEntry(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update timeline entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTimelineEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/timeline-entries/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Timeline entry deleted",
        description: "Timeline entry has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeline-entries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete timeline entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertTimelineEntrySchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      dateRange: "",
      skills: [] as string[],
      order: 0,
    },
  });

  const handleOpenModal = (entry?: TimelineEntry) => {
    if (entry) {
      setIsEditMode(true);
      setCurrentEntry(entry);
      form.reset({
        title: entry.title,
        company: entry.company,
        description: entry.description,
        dateRange: entry.dateRange,
        skills: entry.skills,
        order: entry.order,
      });
    } else {
      setIsEditMode(false);
      setCurrentEntry(null);
      
      // Set default order as the next available order number
      const nextOrder = timelineEntries 
        ? Math.max(0, ...timelineEntries.map(e => e.order)) + 1 
        : 0;
      
      form.reset({
        title: "",
        company: "",
        description: "",
        dateRange: "",
        skills: [] as string[],
        order: nextOrder,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    // Convert skills to array if it's a comma-separated string
    const formattedData = {
      ...data,
      skills: typeof data.skills === 'string'
        ? data.skills.split(',').map((skill: string) => skill.trim())
        : data.skills,
    };

    if (isEditMode && currentEntry) {
      updateTimelineEntryMutation.mutate({
        id: currentEntry.id,
        data: formattedData,
      });
    } else {
      createTimelineEntryMutation.mutate(formattedData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timeline Entries</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Timeline Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : timelineEntries && timelineEntries.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...timelineEntries]
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.order}</TableCell>
                    <TableCell className="font-medium">{entry.title}</TableCell>
                    <TableCell>{entry.company}</TableCell>
                    <TableCell>{entry.dateRange}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(entry)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete timeline entry?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The timeline entry will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTimelineEntryMutation.mutate(entry.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No timeline entries found. Add your first entry to get started.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Timeline Entry" : "Add New Timeline Entry"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {isEditMode ? "update the" : "create a new"} timeline entry.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Job Title or Education" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company / Institution</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Company or Institution Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Range</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 2018 - 2021" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0"
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Description of your role and responsibilities" 
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="React, Node.js, Project Management, etc." 
                        value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter skills separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createTimelineEntryMutation.isPending || updateTimelineEntryMutation.isPending}>
                  {(createTimelineEntryMutation.isPending || updateTimelineEntryMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditMode ? "Update Entry" : "Create Entry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for managing profile information
function ProfileManagement() {
  const { toast } = useToast();
  const [skillFields, setSkillFields] = useState<{name: string; percentage: number}[]>([]);

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      avatar: "",
      email: "",
      location: "",
      resumeUrl: "",
      socialLinks: {
        github: "",
        linkedin: "",
        twitter: "",
        dev: "",
      },
      skills: {},
    },
  });

  // Initialize form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        avatar: profile.avatar,
        email: profile.email,
        location: profile.location,
        resumeUrl: profile.resumeUrl,
        socialLinks: profile.socialLinks,
        skills: profile.skills,
      });

      // Convert skills object to array for easier form handling
      const skillsArray = Object.entries(profile.skills).map(([name, percentage]) => ({
        name,
        percentage,
      }));
      setSkillFields(skillsArray);
    }
  }, [profile, form]);

  const addSkillField = () => {
    setSkillFields([...skillFields, { name: "", percentage: 50 }]);
  };

  const removeSkillField = (index: number) => {
    const updatedFields = [...skillFields];
    updatedFields.splice(index, 1);
    setSkillFields(updatedFields);
  };

  const updateSkillField = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const updatedFields = [...skillFields];
    updatedFields[index][field] = value as never;
    setSkillFields(updatedFields);
  };

  const onSubmit = (data: any) => {
    // Convert skill fields to the expected object format
    const skillsObject: Record<string, number> = {};
    skillFields.forEach(skill => {
      if (skill.name.trim()) {
        skillsObject[skill.name.trim()] = skill.percentage;
      }
    });

    // Update the form data with the skills object
    const formData = {
      ...data,
      skills: skillsObject,
    };

    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full-Stack Developer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="john.doe@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="San Francisco, CA" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Tell us about yourself" 
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>
                      You can use line breaks to separate paragraphs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/avatar.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resumeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/resume.pdf" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Add links to your social media profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="socialLinks.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://github.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLinks.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://linkedin.com/in/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="socialLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://twitter.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLinks.dev"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dev.to</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://dev.to/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Add your professional skills with proficiency levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillFields.map((skill, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-1">
                      <FormLabel htmlFor={`skill-name-${index}`}>Skill Name</FormLabel>
                      <Input
                        id={`skill-name-${index}`}
                        value={skill.name}
                        onChange={(e) => updateSkillField(index, 'name', e.target.value)}
                        placeholder="e.g., JavaScript, React, Node.js"
                      />
                    </div>
                    <div className="w-24">
                      <FormLabel htmlFor={`skill-percentage-${index}`}>Percentage</FormLabel>
                      <Input
                        id={`skill-percentage-${index}`}
                        type="number"
                        min="1"
                        max="100"
                        value={skill.percentage}
                        onChange={(e) => updateSkillField(index, 'percentage', parseInt(e.target.value))}
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon"
                      onClick={() => removeSkillField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addSkillField}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Profile...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Component for managing messages
function MessagesManagement() {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/contact-messages"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/contact-messages/${id}/read`, null);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to mark message as read",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact-messages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "Message has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      if (selectedMessage) {
        setSelectedMessage(null);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Messages</h2>

      {messages && messages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 border rounded-md overflow-hidden">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b">
              <h3 className="font-medium">Messages</h3>
            </div>
            <div className="divide-y max-h-[600px] overflow-auto">
              {messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`p-4 cursor-pointer ${
                    selectedMessage?.id === message.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  } ${!message.isRead ? "font-semibold" : ""}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{message.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {message.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription>
                      From: {selectedMessage.name} ({selectedMessage.email})
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete message?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The message will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMessageMutation.mutate(selectedMessage.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-6 whitespace-pre-wrap">{selectedMessage.message}</div>
                  <div className="mt-6">
                    <Button variant="outline" asChild>
                      <a href={`mailto:${selectedMessage.email}`}>Reply via Email</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400 border rounded-md">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No messages yet. When visitors contact you through the contact form, their messages will appear here.
        </div>
      )}
    </div>
  );
}

// Main Admin Page Component
export default function AdminPage() {
  const { user } = useAuth();
  const tabs: AdminTab[] = [
    { id: "profile", label: "Profile", component: ProfileManagement },
    { id: "projects", label: "Projects", component: ProjectsManagement },
    { id: "blog", label: "Blog", component: BlogManagement },
    { id: "timeline", label: "Timeline", component: TimelineManagement },
    { id: "messages", label: "Messages", component: MessagesManagement },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, {user?.name}! Manage your portfolio content here.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id}>
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
