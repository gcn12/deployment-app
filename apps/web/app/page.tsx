"use client";

import { useEffect, useState } from "react";

const userID = Math.random();
export default function Home() {
  const [repo, setRepo] = useState("");
  const [status, setStatus] = useState({ message: "idle", data: null });

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:3001/events?userID=${userID}`
    );
    eventSource.onmessage = function (event) {
      setStatus(JSON.parse(event.data));
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (repo.length === 0) {
      return;
    }

    const res = await fetch("http://localhost:3001/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo, userID }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="grid place-content-center">
      <div className="h-[400px] [border:1px_solid_black] rounded-12px w-[500px] py-24px px-30px flex justify-center flex-col">
        <form onSubmit={submit} className="w-full">
          <label className="flex flex-col">
            GitHub repo URL:{" "}
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="[border:1px_solid_black] px-8px py-4px rounded-4px"
            />
          </label>
          {status.message === "idle" ? <button>Deploy</button> : null}
        </form>
        {status.message === "creating-ec2" ? (
          <p>Creating EC2 instance</p>
        ) : null}
        {status.message === "starting-server" ? <p>Starting server</p> : null}
        {status.message === "completed" && status.data ? (
          <a href={status.data}>{status.data}</a>
        ) : null}
      </div>
    </div>
  );
}
