from analysis.teams import total_matches, total_teams
from analysis.batting import orange_cap
from analysis.bowling import purple_cap


def dashboard_summary():
    return {
        "total_matches": total_matches(),
        "total_teams": total_teams(),
        "orange_cap": orange_cap(),
        "purple_cap": purple_cap()
    }
from analysis.loader import players

def total_players():
    return len(players)