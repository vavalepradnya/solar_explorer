from flask import Flask, render_template, request, redirect, session, url_for
import re

app = Flask(__name__)
app.secret_key = 'your_secret_key_here_change_in_production'

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if email == 'spaceedu@gmail.com' and password == 'space@1234':
            session['user_email'] = email
            return redirect(url_for('dashboard'))
        else:
            error = 'Invalid email or password'
            return render_template('login.html', error=error)
    
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('dashboard.html', user_email=session['user_email'])

@app.route('/solar-explorer')
def solar_explorer():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('solar_explorer.html', user_email=session['user_email'])

@app.route('/game-zone')
def game_zone():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('game_zone.html', user_email=session['user_email'])

@app.route('/mercury-game')
def mercury_game():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('mercury_game.html', user_email=session['user_email'])

@app.route('/mars-game')
def mars_game():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('mars_game.html', user_email=session['user_email'])

@app.route('/earth-game')
def earth_game():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('earth_game.html', user_email=session['user_email'])

@app.route('/venus-game')
def venus_game():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('venus_game.html', user_email=session['user_email'])

@app.route('/venus-mission')
def venus_mission():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('venus_mission.html', user_email=session['user_email'])

@app.route('/orbit-speed')
def orbit_speed():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('orbit_speed_slide.html', user_email=session['user_email'])

@app.route('/gravity-weight')
def gravity_weight():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('gravity_weight.html', user_email=session['user_email'])

@app.route('/jupiter-explorer')
def jupiter_explorer():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('jupiter_explorer.html', user_email=session['user_email'])

@app.route('/saturn-explorer')
def saturn_explorer():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('saturn_explorer.html', user_email=session['user_email'])

@app.route('/uranus-explorer')
def uranus_explorer():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('uranus_explorer.html', user_email=session['user_email'])

@app.route('/mercury-survival')
def mercury_survival():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('mercury_survival.html', user_email=session['user_email'])

@app.route('/moon-explorer')
def moon_explorer():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('moon_explorer.html', user_email=session['user_email'])

@app.route('/sun-explorer-mission')
def sun_explorer_mission():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('sun_explorer_mission.html', user_email=session['user_email'])

@app.route('/neptune-explorer')
def neptune_explorer():
    if 'user_email' not in session:
        return redirect(url_for('login'))
    
    return render_template('neptune_explorer.html', user_email=session['user_email'])

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)