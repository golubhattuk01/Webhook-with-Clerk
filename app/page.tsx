"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { useEffect } from "react";
export default function Home() {
  const { user } = useUser();
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div className="h-screen  p-4 w-screen justify-center items-center flex flex-col">
      <h1>{`welcome ${user?.fullName}`}</h1> 
      <UserButton />
      
    </div>
  );
}
