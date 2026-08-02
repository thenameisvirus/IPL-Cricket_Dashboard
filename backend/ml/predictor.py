import pickle

model_file = open("ml/model.pkl", "rb")
saved = pickle.load(model_file)

model = saved["model"]

team1_encoder = saved["team1_encoder"]
team2_encoder = saved["team2_encoder"]
toss_encoder = saved["toss_encoder"]
decision_encoder = saved["decision_encoder"]
venue_encoder = saved["venue_encoder"]
winner_encoder = saved["winner_encoder"]


def predict_match(team1, team2, toss_winner, toss_decision, venue):
    try:
        data = [[
            team1_encoder.transform([team1])[0],
            team2_encoder.transform([team2])[0],
            toss_encoder.transform([toss_winner])[0],
            decision_encoder.transform([toss_decision])[0],
            venue_encoder.transform([venue])[0],
        ]]

        prediction = model.predict(data)[0]

        winner = winner_encoder.inverse_transform([prediction])[0]

        probabilities = model.predict_proba(data)[0]

        classes = winner_encoder.classes_

        probability_dict = {}

        for team, probability in zip(classes, probabilities):
            probability_dict[team] = round(probability * 100, 2)

        return {
            "Predicted Winner": winner,
            "Winning Probability": probability_dict,
        }

    except Exception as e:
        return {
            "error": str(e)
        }
        