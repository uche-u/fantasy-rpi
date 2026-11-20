function LeaderboardRow({ rank, username, credits }) {
  return (
    <div className="p-2 rounded">
      <div className="d-flex justify-content-between">
        <div>{rank}</div>
        <div>{username}</div>
        <div>{credits}</div>
      </div>
    </div>
  );
}

export default LeaderboardRow;