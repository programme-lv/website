"use client";

import Layout from "@/components/layout";
import { getMaxScorePerTask } from "@/lib/subms";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { use, useContext } from 'react';
import UserScoresTable from "@/components/user-scores-table";
import AccountCard from "@/components/account-card";
import { AuthContext } from "@/app/providers";
import { decodeUsernamePageParam } from "@/lib/username";

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: encodedUsername } = use(params);
  const username = decodeUsernamePageParam(encodedUsername);
  const { user } = useContext(AuthContext);
  const isOwner = user?.username === username;
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['userScores', username],
    queryFn: () => getMaxScorePerTask(username),
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <Layout active="tasks">
        <Toaster/>
        <div className="m-3 flex flex-col gap-3">
          {isOwner && user && <AccountCard user={user} />}
          <div className="bg-white p-3 rounded-small border-small border-divider">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !response) {
    return (
      <Layout active="tasks">
        <Toaster/>
        <div className="m-3 flex flex-col gap-3">
          {isOwner && user && <AccountCard user={user} />}
          <div className="bg-white p-3 rounded-small border-small border-divider">
            <p>Neizdevās ielādēt lietotāja datus.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Temporarily show only solved tasks on profiles. Keep partial scores in the API.
  const completedTasks = Object.entries(response).filter(([, score]) => {
    const received = score.received_tenths ?? score.received * 10;
    const possible = score.possible_tenths ?? score.possible * 10;
    return possible > 0 && received === possible;
  });

  return (
    <Layout active="tasks">
      <Toaster/>
      <div className="m-3 flex flex-col gap-3">
        {isOwner && user && <AccountCard user={user} />}
        <div className="bg-white p-3 rounded-sm border-small border-divider">
          <h1 className="wrap-anywhere text-2xl">{username}</h1>
          {/* <p>Lietotājs izveidots {new Date(response.created_at).toLocaleDateString()}</p> */}
          <br></br>
          <h2 className="text-xl">Izpildītie uzdevumi</h2>
          {completedTasks.length > 0 ? (
            <UserScoresTable scores={Object.fromEntries(completedTasks)} />
          ) : (
            <p className="mt-2 text-sm text-default-600">Nav izpildītu uzdevumu.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
