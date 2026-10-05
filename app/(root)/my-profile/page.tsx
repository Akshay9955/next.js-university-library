import React from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import Booklist from "@/components/ui/Booklist";
import { sampleBooks } from "@/constants";

const Page = () => {
  return (
    <>
      <form action={logout} className="mb-10">
        <Button type="submit" className="bg-amber-100 text-red-400">
          Logout
        </Button>
      </form>

      <Booklist title="Borrowed Books" books={sampleBooks} />
    </>
  );
};
export default Page;
