"use client";

import { cn } from "@/components/cn";
import Layout from "@/components/layout";
import { TextLink } from "@/components/text-link";
import { getMaxScorePerTask } from "@/lib/subms";
import { useQuery } from "react-query";
import { Toaster } from 'react-hot-toast';
import { use } from 'react';

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { data: response, isLoading, error } = useQuery(['userScores', username], () => getMaxScorePerTask(username), {
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

  return (
    <Layout breadcrumbs={breadcrumbs} active="tasks">
      <Toaster/>
        <div className="m-3">
          <div className="bg-white p-3 rounded-small border-small border-divider">
            <h1 className="text-2xl">{username}</h1>
            {/* <p>Lietotājs izveidots {new Date(response.created_at).toLocaleDateString()}</p> */}
            <br></br>
            <h2 className="text-xl">Izpildītie uzdevumi</h2>
            <table className="rounded-sm table-fixed">
              <thead>
              <tr className="border-b border-gray-300 text-gray-900 text-sm">
                  <th className="p-2 text-left font-normal border-r">Uzdevums</th>
                  <th className="p-2 text-left font-normal border-r">Punkti</th>
                  <th className="p-2 text-left font-normal">Izpildīts</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response)
                  .filter(([_, score]) => score.received == score.possible)
                  .sort(([_, a], [__, b]) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map(([task_id, score], i) => (
                    <tr key={task_id} className={cn({ "border-b border-divider": i !== Object.entries(response).length - 1 }, { "bg-gray-50": i % 2 === 0 })}>
                      <td className="p-2 py-2.5 border-r"><TextLink href={`/tasks/${task_id}`}>{score.task_full_name}</TextLink></td>
                      <td className="p-2 py-2.5 border-r">{score.received}/{score.possible}</td>
                      <td className="p-2 py-2.5"><SubmTableDateTimeCell dateTime={score.created_at} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <br></br>
            <h2 className="text-xl">Iesāktie uzdevumi</h2>
            <table>
              <thead>
                <tr className="border-b border-gray-300 text-gray-900 text-sm">
                  <th className="p-2 text-left font-normal border-r">Uzdevums</th>
                  <th className="p-2 text-left font-normal border-r">Punkti</th>
                  <th className="p-2 text-left font-normal">Iesūtīts</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response)
                  .filter(([_, score]) => score.received != score.possible)
                  .sort(([_, a], [__, b]) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map(([task_id, score], i) => (
                    <tr key={task_id} className={cn({ "border-b border-divider": i !== Object.entries(response).length - 1 }, { "bg-gray-50": i % 2 === 0 })}>
                      <td className="p-2 py-2.5 border-r"><TextLink href={`/tasks/${task_id}`}>{score.task_full_name}</TextLink></td>
                      <td className="p-2 py-2.5 border-r">{score.received}/{score.possible}</td>
                      <td className="p-2 py-2.5"><SubmTableDateTimeCell dateTime={score.created_at} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
    </Layout>
  );
}

function SubmTableDateTimeCell({ dateTime }: { dateTime: string }) {
    const time = new Date(dateTime);
    let date = time.toLocaleString("lv").split(" ")[0];
    if (date.split(".")[0].length < 2) {
        date = "0" + date;
    }
    return (
        <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
            <span>{date}</span>
        </div>
    )
}