from analysis.loader import ball_data, players


def top_batsman():
    batsman = (
        ball_data.groupby("Batter")["BatsmanRun"]
        .sum()
        .sort_values(ascending=False)
        .head(10)
    )
    return batsman.to_dict()


def orange_cap():
    runs = (
        ball_data.groupby("Batter")["BatsmanRun"]
        .sum()
        .sort_values(ascending=False)
        .head(1)
    )
    return runs.to_dict()


def most_sixes():
    sixes = (
        ball_data[ball_data["BatsmanRun"] == 6]
        .groupby("Batter")
        .size()
        .sort_values(ascending=False)
        .head(10)
    )
    return sixes.to_dict()


def most_fours():
    fours = (
        ball_data[ball_data["BatsmanRun"] == 4]
        .groupby("Batter")
        .size()
        .sort_values(ascending=False)
        .head(10)
    )
    return fours.to_dict()


def search_player(player_name):
    result = ball_data[
        ball_data["Batter"].str.contains(
            player_name,
            case=False,
            na=False
        )
    ]

    if result.empty:
        return {"message": "Player not found"}

    actual_name = result.iloc[0]["Batter"]

    runs = int(result["BatsmanRun"].sum())
    balls = int(len(result))
    fours = int((result["BatsmanRun"] == 4).sum())
    sixes = int((result["BatsmanRun"] == 6).sum())

    dismissals = result["IsWicketDelivery"].sum()

    average = (
        round(runs / dismissals, 2)
        if dismissals > 0
        else runs
    )

    strike_rate = (
        round((runs / balls) * 100, 2)
        if balls > 0
        else 0
    )

    matches = result["ID"].nunique()

    return {
        "Player": actual_name,
        "Matches": int(matches),
        "Runs": runs,
        "Balls": balls,
        "Fours": fours,
        "Sixes": sixes,
        "Average": average,
        "Strike Rate": strike_rate,
    }


def player_profile(player_name):
    result = players[
        players["Name"].str.contains(
            player_name,
            case=False,
            na=False
        )
    ]

    if result.empty:
        return {"message": "Player not found"}

    player = result.iloc[0]

    stats = search_player(player_name)

    return {
        "Name": player["Name"],
        "Role": player["playingRoles"],
        "Batting Style": player["longBattingStyles"],
        "Bowling Style": player["longBowlingStyles"],
        "Date of Birth": player["dob"],
        "Matches": stats.get("Matches", 0),
        "Runs": stats.get("Runs", 0),
        "Balls": stats.get("Balls", 0),
        "Fours": stats.get("Fours", 0),
        "Sixes": stats.get("Sixes", 0),
        "Average": stats.get("Average", 0),
        "Strike Rate": stats.get("Strike Rate", 0),
    }
    