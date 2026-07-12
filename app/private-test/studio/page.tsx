import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PrivateStudio } from "@/components/private-studio";
import { requirePrivateSession } from "@/lib/server/private-session";

export const metadata:Metadata={title:"Private Artwork Studio",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function PrivateStudioPage(){try{await requirePrivateSession();}catch{redirect("/private-test");}return <PrivateStudio/>}
