import React from "react";
import CallList from "./CallList";

const Prev = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous Meetings</h1>

    <CallList type='ended'/>
    </section>
  );
};

export default Prev;

