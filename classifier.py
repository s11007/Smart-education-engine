import numpy as np
import pandas as pd

def classify(data):
    mean_score = data['Score'].mean()
    mean_time = data['LearningTime'].mean()
    data['quadrant'] = np.select([(data['Score'] >= mean_score) & (data['LearningTime'] >= mean_time),
                                  (data['Score'] < mean_score) & (data['LearningTime'] >= mean_time),
                                  (data['Score'] < mean_score) & (data['LearningTime'] < mean_time)],
                                 [1, 4, 3], default=2)
    return data['quadrant']

def classify_student(data):
    mean_score = data['Score'].mean()
    mean_time = data['LearningTime'].mean()
    data['Category'] = np.select([(data['Score'] >= mean_score) & (data['LearningTime'] >= mean_time),
                                  (data['Score'] < mean_score) & (data['LearningTime'] >= mean_time),
                                  (data['Score'] < mean_score) & (data['LearningTime'] < mean_time)],
                                 [1, 2, 3], default=4)
    return data['Category']

def create_learning_plan(student_category):
    plans = {
        1: "設定更具挑戰性的學習目標，深化在項目上的專業知識!!",
        2: "鼓勵深入理解學科內容，建立自主學習計畫!!",
        3: "設定具體的短期和中期學習目標，在達成目標時給予獎勵，能激發學習動機!!",
        4: "改進學習方法，例如增加閱讀理解、做筆記等技巧!!"
    }
    return plans.get(student_category, "未分類")

