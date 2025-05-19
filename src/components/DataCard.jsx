import React from "react";

export default function DataCard() {
  return (
    <div className="data-card">
      <div className="data-numbers">
        <p>Accessible Market %</p>
        <Copy delay={0.8}>
          <h2>38%</h2>
        </Copy>
      </div>
      <div className="description-txt">
        <Copy delay={0.5}>
          <p>
            With digital adoption accelerating, roughly 38% of Africa’s market
            is already accessible to innovative solutions, and this share is
            expanding every year.
          </p>
        </Copy>
      </div>
    </div>
  );
}
