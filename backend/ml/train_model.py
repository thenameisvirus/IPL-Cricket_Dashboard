import pickle

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from analysis.loader import match_info


def train_model():
    df = match_info.copy()

    # Required Columns
    df = df[
        [
            "team1",
            "team2",
            "toss_winner",
            "toss_decision",
            "venue",
            "winner",
        ]
    ]

    # Remove Missing Values
    df = df.dropna()

    # Remove Matches Without Result
    df = df[df["winner"] != "No Result"]

    # Label Encoders
    team1_encoder = LabelEncoder()
    team2_encoder = LabelEncoder()
    toss_encoder = LabelEncoder()
    decision_encoder = LabelEncoder()
    venue_encoder = LabelEncoder()
    winner_encoder = LabelEncoder()

    df["team1"] = team1_encoder.fit_transform(df["team1"])
    df["team2"] = team2_encoder.fit_transform(df["team2"])
    df["toss_winner"] = toss_encoder.fit_transform(df["toss_winner"])
    df["toss_decision"] = decision_encoder.fit_transform(df["toss_decision"])
    df["venue"] = venue_encoder.fit_transform(df["venue"])
    df["winner"] = winner_encoder.fit_transform(df["winner"])

    X = df[
        [
            "team1",
            "team2",
            "toss_winner",
            "toss_decision",
            "venue",
        ]
    ]

    y = df["winner"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
    )

    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)

    print("--------------------------------")
    print("Model Accuracy :", round(accuracy * 100, 2), "%")
    print("--------------------------------")

    with open("ml/model.pkl", "wb") as file:
        pickle.dump(
            {
                "model": model,
                "team1_encoder": team1_encoder,
                "team2_encoder": team2_encoder,
                "toss_encoder": toss_encoder,
                "decision_encoder": decision_encoder,
                "venue_encoder": venue_encoder,
                "winner_encoder": winner_encoder,
            },
            file,
        )

    print("Model Saved Successfully.")


if __name__ == "__main__":
    train_model()