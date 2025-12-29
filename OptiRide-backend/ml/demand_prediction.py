import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

# -----------------------------
# 1. Sample training data
# -----------------------------
data = {
    "hour": [8, 9, 10, 18, 19, 20, 21, 22],
    "day": ["Mon", "Mon", "Tue", "Fri", "Fri", "Sat", "Sat", "Sun"],
    "requests": [10, 12, 15, 40, 45, 50, 55, 60],
    "demand": ["Low", "Low", "Medium", "High", "High", "High", "High", "High"]
}

df = pd.DataFrame(data)

# Encode categorical data
le_day = LabelEncoder()
le_demand = LabelEncoder()

df["day"] = le_day.fit_transform(df["day"])
df["demand"] = le_demand.fit_transform(df["demand"])

X = df[["hour", "day", "requests"]]
y = df["demand"]

# -----------------------------
# 2. Train model
# -----------------------------
model = LogisticRegression()
model.fit(X, y)

# -----------------------------
# 3. Predict demand
# -----------------------------
def predict_demand(hour, day, requests):
    day_encoded = le_day.transform([day])[0]
    pred = model.predict([[hour, day_encoded, requests]])
    return le_demand.inverse_transform(pred)[0]


# Demo run
if __name__ == "__main__":
    result = predict_demand(19, "Fri", 48)
    print("Predicted Demand:", result)
