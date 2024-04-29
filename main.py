from flask import Flask, render_template, session, request, redirect, jsonify
import os
from driver import SchooltoolDriver

app = Flask(__name__)
app.secret_key = os.urandom(24).hex()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if username is None or password is None:
            return redirect("/")
        s = SchooltoolDriver(password, username)
        d = s.run()
        if d == None:
            return jsonify({"failed": 'error'})
        return jsonify(d)
    else:
        return render_template("index.html")



if __name__ == '__main__':
    app.run()