from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from auth.login import router as auth_router

from analysis.teams import (
    total_matches,
    total_teams,
    team_wins,
    team_wins_chart,
    venue_statistics,
    city_statistics,
    team_list,
    venue_list,
    compare_teams,
)

from analysis.batting import (
    top_batsman,
    orange_cap,
    most_sixes,
    most_fours,
    search_player,
    player_profile,
)

from analysis.bowling import (
    top_bowlers,
    purple_cap,
)

from analysis.dashboard import (
    dashboard_summary,
    total_players,
)

from analysis.loader import players

from ml.predictor import predict_match


app = FastAPI(title="IPL Cricket Statistics API")


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "IPL Cricket Statistics API Running Successfully"
    }


# =========================================================
# DASHBOARD
# =========================================================

@app.get("/dashboard")
def get_dashboard():
    return dashboard_summary()


@app.get("/total_matches")
def get_total_matches():
    return {
        "Total Matches": total_matches()
    }


@app.get("/total_teams")
def get_total_teams():
    return {
        "Total Teams": total_teams()
    }


@app.get("/total_players")
def get_total_players():
    return {
        "Total Players": total_players()
    }


# =========================================================
# TEAMS
# =========================================================

@app.get("/team_wins")
def get_team_wins():
    return team_wins()


@app.get("/team_wins_chart")
def get_team_wins_chart():
    return team_wins_chart()


@app.get("/teams")
def get_teams():
    return team_list()


@app.get("/venues")
def get_venues():
    return venue_list()


@app.get("/venue_statistics")
def get_venue_statistics():
    return venue_statistics()


@app.get("/city_statistics")
def get_city_statistics():
    return city_statistics()


@app.get("/compare_teams")
def get_compare_teams(
    team1: str = Query(...),
    team2: str = Query(...)
):
    return compare_teams(team1, team2)


# =========================================================
# PLAYERS
# =========================================================

@app.get("/players")
def get_players():
    """
    Return all players from the players dataset.
    Used by the Players page.
    """

    if players is None or players.empty:
        return []

    player_data = players.copy()

    # Remove duplicate player records
    if "Name" in player_data.columns:
        player_data = player_data.drop_duplicates(
            subset=["Name"]
        )

    # Replace NaN / missing values
    player_data = player_data.fillna("")

    # Convert dataframe to JSON-safe records
    return player_data.to_dict(orient="records")


# =========================================================
# PLAYER SEARCH
# =========================================================

@app.get("/search_player")
def get_search_player(
    player: str = Query(...)
):
    return search_player(player)


# =========================================================
# PLAYER PROFILE
# =========================================================

@app.get("/player_profile")
def get_player_profile(
    player: str = Query(...)
):
    return player_profile(player)


# =========================================================
# BATTING
# =========================================================

@app.get("/top_batsman")
def get_top_batsman():
    return top_batsman()


@app.get("/orange_cap")
def get_orange_cap():
    return orange_cap()


@app.get("/most_sixes")
def get_most_sixes():
    return most_sixes()


@app.get("/most_fours")
def get_most_fours():
    return most_fours()


# =========================================================
# BOWLING
# =========================================================

@app.get("/top_bowlers")
def get_top_bowlers():
    return top_bowlers()


@app.get("/purple_cap")
def get_purple_cap():
    return purple_cap()


# =========================================================
# MACHINE LEARNING
# =========================================================

@app.get("/predict_match")
def get_prediction(
    team1: str = Query(...),
    team2: str = Query(...),
    toss_winner: str = Query(...),
    toss_decision: str = Query(...),
    venue: str = Query(...)
):
    return predict_match(
        team1,
        team2,
        toss_winner,
        toss_decision,
        venue,
    )


# =========================================================
# AUTHENTICATION
# =========================================================

app.include_router(auth_router)