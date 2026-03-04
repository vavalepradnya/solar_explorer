import os
import re
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, redirect, session, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key_here_change_in_production')

# Database Configuration
# Update this with your actual PostgreSQL connection string
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/solar_explorer')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active_account = db.Column(db.Boolean, default=True) # Renamed to avoid conflict with UserMixin.is_active
    role = db.Column(db.String(20), default='user') # 'admin' or 'user'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    @property
    def is_active(self):
        return self.is_active_account

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'admin':
            flash('Access Denied. Admins only.')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not email or not password:
            error = 'Please fill in all fields'
            return render_template('login.html', error=error)
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            if not user.is_active_account:
                error = 'Access Denied. Contact Admin.'
                return render_template('login.html', error=error)
            
            user.last_login = datetime.utcnow()
            db.session.commit()
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            error = 'Invalid email or password'
            return render_template('login.html', error=error)
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if not name or not email or not password or not confirm_password:
            error = 'Please fill in all fields'
            return render_template('signup.html', error=error)
        
        if not is_valid_email(email):
            error = 'Please enter a valid email address'
            return render_template('signup.html', error=error)
        
        if password != confirm_password:
            error = 'Passwords do not match'
            return render_template('signup.html', error=error)
        
        if len(password) < 6:
            error = 'Password must be at least 6 characters long'
            return render_template('signup.html', error=error)
        
        if User.query.filter_by(email=email).first():
            error = 'Email already exists'
            return render_template('signup.html', error=error)
        
        # First user registered becomes admin
        role = 'admin' if User.query.count() == 0 else 'user'
        
        new_user = User(name=name, email=email, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        return redirect(url_for('dashboard'))
    
    return render_template('signup.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/admin/dashboard')
@login_required
@admin_required
def admin_dashboard():
    users = User.query.all()
    return render_template('admin_dashboard.html', users=users)

@app.route('/admin/toggle-status/<int:user_id>')
@login_required
@admin_required
def toggle_status(user_id):
    user = User.query.get_or_404(user_id)
    if user.id == current_user.id:
        flash('You cannot deactivate yourself.')
    else:
        user.is_active_account = not user.is_active_account
        db.session.commit()
        flash(f'Status for {user.email} updated.')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/delete-user/<int:user_id>')
@login_required
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.id == current_user.id:
        flash('You cannot delete yourself.')
    else:
        db.session.delete(user)
        db.session.commit()
        flash(f'User {user.email} deleted.')
    return redirect(url_for('admin_dashboard'))

@app.route('/solar-explorer')
@login_required
def solar_explorer():
    return render_template('solar_explorer.html', user=current_user)

@app.route('/game-zone')
@login_required
def game_zone():
    return render_template('game_zone.html', user=current_user)

@app.route('/mercury-game')
@login_required
def mercury_game():
    return render_template('mercury_game.html', user=current_user)

@app.route('/mars-game')
@login_required
def mars_game():
    return render_template('mars_game.html', user=current_user)

@app.route('/earth-game')
@login_required
def earth_game():
    return render_template('earth_game.html', user=current_user)

@app.route('/venus-game')
@login_required
def venus_game():
    return render_template('venus_game.html', user=current_user)

@app.route('/venus-mission')
@login_required
def venus_mission():
    return render_template('venus_mission.html', user=current_user)

@app.route('/orbit-speed')
@login_required
def orbit_speed():
    return render_template('orbit_speed_slide.html', user=current_user)

@app.route('/gravity-weight')
@login_required
def gravity_weight():
    return render_template('gravity_weight.html', user=current_user)

@app.route('/jupiter-explorer')
@login_required
def jupiter_explorer():
    return render_template('jupiter_explorer.html', user=current_user)

@app.route('/saturn-explorer')
@login_required
def saturn_explorer():
    return render_template('saturn_explorer.html', user=current_user)

@app.route('/uranus-explorer')
@login_required
def uranus_explorer():
    return render_template('uranus_explorer.html', user=current_user)

@app.route('/mercury-survival')
@login_required
def mercury_survival():
    return render_template('mercury_survival.html', user=current_user)

@app.route('/moon-explorer')
@login_required
def moon_explorer():
    return render_template('moon_explorer.html', user=current_user)

@app.route('/sun-explorer-mission')
@login_required
def sun_explorer_mission():
    return render_template('sun_explorer_mission.html', user=current_user)

@app.route('/neptune-explorer')
@login_required
def neptune_explorer():
    return render_template('neptune_explorer.html', user=current_user)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Basic table creation if migration not used
    app.run(debug=True)