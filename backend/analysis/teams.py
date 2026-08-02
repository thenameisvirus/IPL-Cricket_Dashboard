from analysis.loader import match_info, teams


def total_matches():
    return len(match_info)


def total_teams():
    return len(teams)


def team_wins():
    return match_info["winner"].value_counts().to_dict()


def team_wins_chart():
    wins = (
        match_info["winner"]
        .value_counts()
        .reset_index()
    )

    wins.columns = ["team", "wins"]

    return wins.to_dict(orient="records")


def venue_statistics():
    home_city = {
        "Mumbai Indians": "Mumbai",
        "Chennai Super Kings": "Chennai",
        "Royal Challengers Bengaluru": "Bengaluru",
        "Royal Challengers Bangalore": "Bengaluru",
        "Kolkata Knight Riders": "Kolkata",
        "Delhi Capitals": "Delhi",
        "Delhi Daredevils": "Delhi",
        "Sunrisers Hyderabad": "Hyderabad",
        "Deccan Chargers": "Hyderabad",
        "Rajasthan Royals": "Jaipur",
        "Punjab Kings": "Mohali",
        "Kings XI Punjab": "Mohali",
        "Lucknow Super Giants": "Lucknow",
        "Gujarat Titans": "Ahmedabad",
        "Gujarat Lions": "Rajkot",
        "Rising Pune Supergiant": "Pune",
        "Rising Pune Supergiants": "Pune",
        "Pune Warriors": "Pune",
        "Kochi Tuskers Kerala": "Kochi",
    }

    city_count = {}

    for team in match_info["team1"]:
        if team in home_city:
            city = home_city[team]
            city_count[city] = city_count.get(city, 0) + 1

    return city_count


def city_statistics():
    city = (
        match_info["city"]
        .value_counts()
        .head(10)
    )

    return city.to_dict()


def team_list():
    return teams["team_name"].sort_values().tolist()


# -----------------------------
# Venue List
# -----------------------------

def venue_list():
    return sorted(
        match_info["venue"]
        .dropna()
        .unique()
        .tolist()
    )


# -----------------------------
# Team Comparison
# -----------------------------

def compare_teams(team1, team2):

    matches = match_info[
        (
            (match_info["team1"] == team1)
            &
            (match_info["team2"] == team2)
        )
        |
        (
            (match_info["team1"] == team2)
            &
            (match_info["team2"] == team1)
        )
    ]

    matches_played = len(matches)

    team1_wins = len(matches[matches["winner"] == team1])

    team2_wins = len(matches[matches["winner"] == team2])

    team1_win_percentage = (
        round((team1_wins / matches_played) * 100, 2)
        if matches_played > 0
        else 0
    )

    team2_win_percentage = (
        round((team2_wins / matches_played) * 100, 2)
        if matches_played > 0
        else 0
    )

    return {
        "team1": team1,
        "team2": team2,
        "matches_played": matches_played,
        "team1_wins": team1_wins,
        "team2_wins": team2_wins,
        "team1_win_percentage": team1_win_percentage,
        "team2_win_percentage": team2_win_percentage,
    }