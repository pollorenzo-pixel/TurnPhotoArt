"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function PrivateAccessForm() {
  const router = useRouter(); const [code,setCode]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const submit=async(event:FormEvent)=>{event.preventDefault();if(busy)return;setBusy(true);setError("");try{const response=await fetch("/api/private-access",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code})});if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||"Access could not be confirmed.");}router.replace("/private-test/studio");router.refresh();}catch(reason){setError(reason instanceof Error?reason.message:"Access could not be confirmed.");}finally{setBusy(false);}};
  return <form className="access-form" onSubmit={submit} aria-busy={busy}><label htmlFor="access-code">Private access code</label><input id="access-code" type="password" autoComplete="one-time-code" value={code} onChange={(e)=>setCode(e.target.value)} maxLength={200} required/><button className="button button-primary" type="submit" disabled={busy}>{busy?"Checking access…":"Enter private test"}</button>{error?<p role="alert">{error}</p>:null}</form>;
}
