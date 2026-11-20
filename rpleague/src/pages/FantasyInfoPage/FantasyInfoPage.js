import NavBar from '../../components/Navbar/NavBar.js';
import './FantasyInfoPage.css';
const FantasyInfoPage = () => {
  return (
    <div>
      <NavBar />
      <div>
        <aside className="left goodTime">
        <div className="row" id="tipsandtricks">
          <div className="col-12 text-center" id="overall-leaderboard">
            <h1 className="text-white goodTime">ABOUT FANTASY SPORTS</h1>
          </div>
        </div>
          <p>
            <strong><h2 className="beeg">Join or Create a League:</h2></strong> Either join an existing league or create your own with friends or random participants.<br />
            <strong><h2 className="beeg">Draft Players:</h2></strong> Before the season starts, you'll have a draft where you choose real-life players from RPI to be on your fantasy team.<br />
            <strong><h2 className="beeg">Score Points:</h2></strong> Your players earn points based on their stats in actual games. For example, in football, a touchdown might be worth 6 points, a yard gained might be worth 0.1 points, etc.<br />
            <strong><h2 className="beeg">Compete Against Others:</h2></strong> Your fantasy team's total points are compared to other teams in your league each week. The team with the most points wins that week's matchup.<br />
            </p>
        </aside>
      </div>
    </div>
  );
};

export default FantasyInfoPage;
