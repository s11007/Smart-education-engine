from flask import Flask, render_template, request, jsonify
import json
import os
import datetime
import pandas as pd
import seaborn as sns
from flask_sqlalchemy import SQLAlchemy
import matplotlib.pyplot as plt
from classifier import classify, classify_student, create_learning_plan
app = Flask(__name__)
student_df = pd.DataFrame()
def get_messages():
    messages = []
    if os.path.exists('messages.json') and os.path.getsize('messages.json') > 0:
        with open('messages.json', 'r') as file:
            messages = json.load(file)
    return messages

def save_message(message):
    messages = get_messages()
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    messages.append({"message": message, "time": current_time})
    with open('messages.json', 'w') as file:
        json.dump(messages, file)

@app.route('/get_messages')
def get_messages_route():
    messages = get_messages()
    return jsonify(messages)

@app.route('/add_message', methods=['POST'])
def add_message():
    message_data = request.get_json()
    message_text = message_data.get('message', '')
    if message_text:
        save_message(message_text)
    return jsonify({'status': 'success'})

def save_learning_record(score, learning_time, student_df):
    df = pd.read_csv(r".\static\student_data.csv")
    new_data = {'Score': pd.to_numeric(score), 'LearningTime': pd.to_numeric(learning_time)}
    new_df = pd.DataFrame(new_data, index=[0])
    df = pd.concat([df.iloc[:, 0:2], new_df], ignore_index=True)
    classify(df)
    classify_student(df)
    df['Category2'] = (df['quadrant'] - 1) * 4 + df['Category']
    learning_plan = create_learning_plan(df['Category'].values[-1])

    sns.set(style="whitegrid")
    plt.figure(figsize=(10, 8))
    sns.scatterplot(x='LearningTime', y='Score', hue='Category2', palette='viridis', data=df, alpha=0.7, s=80)
    plt.scatter(df['LearningTime'].values[-1], df['Score'].values[-1], color='red', marker='X', s=100, label='YOU')
    plt.title('Student Distribution')
    plt.xlabel('Learning Time')
    plt.ylabel('Score')
    plt.legend(title='Category', bbox_to_anchor=(1, 1), loc='upper left')
    plt.show()

    return learning_plan

@app.route('/record_learning', methods=['POST'])
def record_learning():
    global student_df
    data = request.get_json()
    score = data.get('Score')
    learning_time = data.get('LearningTime')

    learning_plan = save_learning_record(score, learning_time, student_df)

    response_message = f"成功儲存學習記錄。Score: {score}, Learning Time: {learning_time}"

    return jsonify({'message': response_message, 'learning_plan': learning_plan})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)
class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)

@app.route('/submit', methods=['POST'])
def submit():
    email = request.form.get('email')
    submission = Submission(email=email)
    db.session.add(submission)
    db.session.commit()
    return '提交成功！我們將與您聯絡。'

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/index.html', endpoint='index_page')
def home():
    return render_template('index.html')
@app.route('/individual-learning.html')
def individual_learning():
    return render_template('individual-learning.html')

@app.route('/educational-resources.html')
def educational_resources():
    return render_template('educational-resources.html')

@app.route('/community.html')
def community():
    return render_template('community.html')

@app.route('/about-us.html')
def about_us():
    return render_template('about-us.html')

if __name__ == '__main__':
    app.run(debug=True)
