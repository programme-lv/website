"use client";

import Layout from "@/components/layout";
import { getMaxScorePerTask } from "@/lib/subms";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { use } from 'react';
import UserScoresTable from "@/components/user-scores-table";

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['userScores', username],
    queryFn: () => getMaxScorePerTask(username),
    enabled: !!username,
  });

  const breadcrumbs = [
    { label: "Lietotāji" },
    { label: username, href: `/users/${username}` },
  ];

  if (isLoading) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="tasks">
        <div className="m-3">
          <div className="bg-white p-3 rounded-small border-small border-divider">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !response) {
    return (
      <Layout breadcrumbs={breadcrumbs} active="tasks">
        <div className="m-3">
          <div className="bg-white p-3 rounded-small border-small border-divider">
            <p>Error loading user data</p>
          </div>
        </div>
      </Layout>
    );
  }

  const completedTasks = Object.fromEntries(
    Object.entries(response).filter(([, score]) => score.received == score.possible)
  );

  const inProgressTasks = Object.fromEntries(
    Object.entries(response).filter(([, score]) => score.received != score.possible)
  );

  return (
    <Layout breadcrumbs={breadcrumbs} active="tasks">
      <Toaster/>
      <div className="m-3">
        <div className="bg-white p-3 rounded-sm border-small border-divider">
          <h1 className="text-2xl">{username}</h1>
          {/* <p>Lietotājs izveidots {new Date(response.created_at).toLocaleDateString()}</p> */}
          <br></br>
          <h2 className="text-xl">Izpildītie uzdevumi</h2>
          <UserScoresTable scores={completedTasks} />
          <br></br>
          <h2 className="text-xl">Iesāktie uzdevumi</h2>
          <UserScoresTable scores={inProgressTasks} />
        </div>
      </div>
    </Layout>
  );
}