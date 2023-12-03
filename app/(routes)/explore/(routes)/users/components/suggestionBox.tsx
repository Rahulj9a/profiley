import React from "react";
import { User } from "@prisma/client";
 import { UseUserSuggestion } from "@/hooks/useUserSuggestion";
import Image from "next/image";
import { UserIcon } from "lucide-react";

interface SuggestionBoxProps {
  input?: string;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ input = "" }) => {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = UseUserSuggestion(input);
  if (isLoading && !error) {
    return (
      <div className="w-full h-fit bg-dark text-light text-center absolute rounded-lg p-2">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full  h-fit bg-dark text-light text-center rounded-lg p-2">
        Something went wrong
      </div>
    );
  }
  const users: User[] = response?.data;

  if (users.length == 0 && !isLoading && !error) {
    return (
      <div className="w-full h-fit bg-dark text-light text-center rounded-lg p-2">
        No result found
      </div>
    );
  }
  return (
    <>
      {
        <div className=" h-fit p-2 max-h-[300px] overflow-x-hidden overflow-y-scroll bg-dark text-light rounded-lg">
          {users &&
            users
              ?.filter((e) => e.username.includes(input as string))
              .map((user: User) => (
                <div
                  key={user.id}
                  className=" w-full rounded-md my-1 p-1 items-center gap-2 bg-light hover:bg-mid cursor-pointer text-darkest flex"
                >
                  <div className="flex gap-2 items-center flex-1">
                    {user.profilepic ? (
                      <Image
                        width={50}
                        height={50}
                        className="object-contain w-8 h-8 rounded-full"
                        alt={user.name as string}
                        src={user.profilepic as string}
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 rounded-full" />
                    )}
                    <span>{user.name}</span>
                    <span className="text-xs">@{user.username}</span>
                  </div>
                  <div className="flex flex-wrap  rounded-sm px-2 py-1 gap-[2px] h-auto ">
                    {user.labels &&
                      user.labels.map(
                        (label: string, index: number) =>
                          index < 3 && (
                            <div
                              key={label}
                              className=" text-[10px]  text-darkest"
                            >
                              {label} |
                            </div>
                          )
                      )}
                  </div>
                </div>
              ))}
        </div>
      }
    </>
  );
};

export default SuggestionBox;