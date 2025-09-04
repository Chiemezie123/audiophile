"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {user.photo && user.photo !== "default.jpg" && (
        <Image
          src={user.photo}
          alt={`${user.firstName} ${user.lastName}`}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}

      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>

      <Button onClick={logout} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  );
}
