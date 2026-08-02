import pandas as pd

# Load all datasets only once

match_info = pd.read_csv("dataset/Match_Info.csv")
ball_data = pd.read_csv("dataset/Ball_By_Ball_Match_Data.csv")
players = pd.read_csv("dataset/2024_players_details.csv")
teams = pd.read_csv("dataset/teams_info.csv")
