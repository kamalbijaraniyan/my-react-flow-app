import React from "react";

const TestComponent = () => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Initial</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">Only one node in a diagram</li>
          <li className="line-through">1 outgoing </li>
          <li className="line-through">0 incoming </li>
          <li className="line-through">Normal flow only</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Block</h3>
        <ul className="list-disc list-inside">
          <li  className="line-through">UL node per diagram</li>
          <li className="line-through">UL incoming</li>
          <li className="line-through">0 Outgoing</li>
          <li className="line-through">any type of flow</li>
          <li className="line-through">Can connect only from DECISION and INTIAL node</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Return</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">UL incoming</li>
          <li className="line-through">0 Outgoing</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Flow Final (END)</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">UL incoming</li>
          <li className="line-through">0 Outgoing</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Business Activity</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">UL incoming</li>
          <li className="line-through">1 outgoing</li>
          <li className="line-through">Outgoing Normal flow only</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Activity</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">UL incoming</li>
          <li className="line-through">1 outgoing</li>
          <li>Requires atleast one Action</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Decision</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">UL incoming</li>
          <li className="line-through">UL outgoing</li>
          <li className="line-through">cannot be 2 ELSE flow</li>
          <li>Connects atleast 2 flows</li>
          <li>Condition is required</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Merge</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">UL incoming</li>
          <li className="line-through">1 outgoing</li>
          <li className="line-through">Outgoing Normal flow only</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-lime-200 p-2">
        <h3 className="text-lg font-bold">Event</h3>
        <ul className="list-disc list-inside">
          <li className="line-through">UL incoming/outgoing</li>
          <li className="line-through">Normal flow only</li>
          <li className="line-through">connects BUSINESS_ACTIVITY, ACTIVITY and MERGE nodes only</li>
        </ul>
      </div>
    </div>
  );
};

export default TestComponent;
