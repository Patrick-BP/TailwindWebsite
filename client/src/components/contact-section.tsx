import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, InsertContactMessage } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, MapPin, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";

export function ContactSection() {
  const { toast } = useToast();
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  // Create form with validation
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
  });

  // Mutation for sending contact message
  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Thank you for your message! I will get back to you soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: InsertContactMessage) => {
    submitMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-primary dark:bg-blue-400 mx-auto mb-8"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? Feel free to reach out!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary dark:bg-blue-600 text-white p-3 rounded-full">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium mb-1">Email</h4>
                  <a 
                    href={`mailto:${profile?.email || 'john.doe@example.com'}`}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400"
                  >
                    {profile?.email || "john.doe@example.com"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary dark:bg-blue-600 text-white p-3 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium mb-1">Location</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile?.location || "San Francisco, California"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary dark:bg-blue-600 text-white p-3 rounded-full">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium mb-1">Social Profiles</h4>
                  <div className="flex space-x-4 mt-2">
                    <a href={profile?.socialLinks?.github || "https://github.com"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                      <i className="fab fa-github text-xl"></i>
                    </a>
                    <a href={profile?.socialLinks?.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                      <i className="fab fa-linkedin text-xl"></i>
                    </a>
                    <a href={profile?.socialLinks?.twitter || "https://twitter.com"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                      <i className="fab fa-twitter text-xl"></i>
                    </a>
                    <a href={profile?.socialLinks?.dev || "https://dev.to"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                      <i className="fab fa-dev text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Download Resume</h3>
              <a 
                href={profile?.resumeUrl || "/resume.pdf"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-md transition-colors font-medium"
              >
                <i className="fas fa-download mr-2"></i>
                <span>Download CV</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Your name" 
                          disabled={submitMutation.isPending}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 bg-white dark:bg-gray-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="Your email" 
                          disabled={submitMutation.isPending}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 bg-white dark:bg-gray-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Message subject" 
                          disabled={submitMutation.isPending}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 bg-white dark:bg-gray-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={5}
                          placeholder="Your message" 
                          disabled={submitMutation.isPending}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 bg-white dark:bg-gray-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-md transition-colors font-medium"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
