
export function generateInsights(data) {
  const insights = [];
  if (data.passengerCount > data.seatStates.total * 0.8)
    insights.push("Capacity Alert: Bus nearing full occupancy");
  if (!data.driver.present)
    insights.push("Driver absence detected during trip");
  return insights;
}
