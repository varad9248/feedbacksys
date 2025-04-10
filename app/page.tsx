"use client";

import { redirect } from "next/navigation";


export default function WelcomePage() {

  redirect("/auth/login");

  return null;
}
