// "use client";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { supabase } from "@/lib/supabase";
// import { useState } from "react";

// const formSchema = z.object({
//   email: z.string().email(),
// });

// export const LoginForm = () => {
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("error");
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const googleOauth = async () => {
//     try {
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//       });
//       if (error) throw error;
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSubmit = async (values) => {
//     const email = values.email;
//     setMessage("");

//     try {
//       const { data, error } = await supabase.auth.signInWithOtp({
//         email: email,
//         options: {
//           shouldCreateUser: true,
//         },
//       });

//       if (error) throw error;

//       setMessage("Check your email for the magic link!");
//       setMessageType("success");
//     } catch (error) {
//       setMessage("There was an error sending the magic link.");
//       setMessageType("error");
//     }
//   };

//   return (
//     <div className="flex-grow flex items-center justify-center">
//       <Card>
//         <CardHeader>
//           <CardTitle>
//             <h1 className="text-2xl">Login to the app</h1>
//           </CardTitle>
//           <CardDescription>
//             Enter your email and sign in with Magic Link
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="flex flex-col gap-4"
//             >
//               <FormField
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         className="text-sm"
//                         placeholder="m@example.com"
//                         type="email"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit">Get Magic Link</Button>
//               {/* Message */}
//               {message && (
//                 <div
//                   className={`p-2 text-sm rounded-md ${
//                     messageType === "error"
//                       ? "bg-red-500 text-white"
//                       : "bg-emerald-500 text-white"
//                   }`}
//                 >
//                   {message}
//                 </div>
//               )}
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter>
//           <div className="flex gap-2 items-center justify-center w-full">
//             <Button
//               variant="outline"
//               type="button"
//               className="w-full"
//               onClick={() => {
//                 googleOauth();
//               }}
//             >
//               <FcGoogle />
//               Google
//             </Button>
//             <Button variant="outline" type="button" className="w-full">
//               <FaGithub />
//               Github
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };
