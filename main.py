from flask import Flask, render_template, session, request, redirect
import os
from driver import SchooltoolDriver

app = Flask(__name__)
app.secret_key = os.urandom(24).hex()

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    if username is None or password is None:
         return redirect("/")
    try:
        s = SchooltoolDriver(password, username)
        s.run()
    except Exception as e:
        s.quit()
    return redirect("/") 


if __name__ == '__main__':
    app.run()