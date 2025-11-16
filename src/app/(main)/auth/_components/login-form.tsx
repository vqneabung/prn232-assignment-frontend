"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth/auth";
import { authStore } from "@/stores/auth/authStore";

const FormSchema = z.object({
  userName: z.string(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const router = useRouter();
  const { setUserName, setRole, setToken } = authStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userName: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const response = await authApi.login(data.userName, data.password);
    if (response.success) {
      toast.success("Login successful!");
      // Await 500 milliseconds to show the toast before redirecting
      Promise.resolve().then(() => setTimeout(() => router.refresh(), 500));
      // Handle successful login (e.g., redirect, update state)
      console.log("Logged in user:", response.data);
      setUserName(response.data.userName);
      setToken(response.data.token);
      setRole(response.data.role);
      redirectToRoleHome(response.data.role);
    } else {
      toast.error(`Login failed: ${response.message || "Unknown error"}`);
    }
  };

  const protectedRoutes = {
    admin: ["/admin"],
    manager: ["/manager"],
    moderator: ["/moderator"],
    examiner: ["/examiner"],
  };

  const redirectToRoleHome = (role: string) => {
    const routes = protectedRoutes[role.toLowerCase() as keyof typeof protectedRoutes];
    if (routes.length > 0) {
      router.push(routes[0]);
    } else {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input id="userName" type="text" placeholder="you@example.com" autoComplete="userName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox
                  id="login-remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-4"
                />
              </FormControl>
              <FormLabel htmlFor="login-remember" className="text-muted-foreground ml-1 text-sm font-medium">
                Remember me for 30 days
              </FormLabel>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
}
