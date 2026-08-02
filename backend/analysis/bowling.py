from analysis.loader import ball_data


def top_bowlers():
    wickets = ball_data[ball_data["IsWicketDelivery"] == 1]
    bowlers = wickets.groupby("Bowler").size()
    return bowlers.sort_values(ascending=False).head(10).to_dict()


def purple_cap():
    wickets = ball_data[ball_data["IsWicketDelivery"] == 1]
    purple = wickets.groupby("Bowler").size()
    return purple.sort_values(ascending=False).head(1).to_dict()