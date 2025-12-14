export const pingLocation = async (req, res) => {
  const { sessionId, lat, lon, accuracy } = req.body;

  const session = await Session.findById(sessionId);
  session.locationPings.push({ lat, lon, accuracy, ts: new Date() });

  // simple movement score
  session.movementScore = session.locationPings.length > 2 ? 1 : 0;

  await session.save();
  res.json({ movementScore: session.movementScore });
};
