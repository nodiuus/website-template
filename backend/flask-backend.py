# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from datetime import datetime
import sqlite3
import os
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')

mail = Mail(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('hvac.db')
    c = conn.cursor()
    
    # Create quotes table
    c.execute('''
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT,
            service_type TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create contact submissions table
    c.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create testimonials table
    c.execute('''
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            approved BOOLEAN DEFAULT FALSE
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Helper function for database connection
def get_db():
    conn = sqlite3.connect('hvac.db')
    conn.row_factory = sqlite3.Row
    return conn

# Routes
@app.route('/api/quote', methods=['POST'])
def request_quote():
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'email', 'phone', 'message', 'service_type']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        c.execute('''
            INSERT INTO quotes (name, email, phone, message, service_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['name'], data['email'], data['phone'], data['message'], data['service_type']))
        
        conn.commit()
        
        # Send email notification
        msg = Message('New Quote Request',
                     sender=app.config['MAIL_USERNAME'],
                     recipients=[os.getenv('ADMIN_EMAIL')])
        msg.body = f'''
        New quote request received:
        Name: {data['name']}
        Email: {data['email']}
        Phone: {data['phone']}
        Service: {data['service_type']}
        Message: {data['message']}
        '''
        mail.send(msg)
        
        return jsonify({'message': 'Quote request submitted successfully'}), 200
    
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'email', 'phone', 'message']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        c.execute('''
            INSERT INTO contacts (name, email, phone, message)
            VALUES (?, ?, ?, ?)
        ''', (data['name'], data['email'], data['phone'], data['message']))
        
        conn.commit()
        
        # Send email notification
        msg = Message('New Contact Form Submission',
                     sender=app.config['MAIL_USERNAME'],
                     recipients=[os.getenv('ADMIN_EMAIL')])
        msg.body = f'''
        New contact form submission:
        Name: {data['name']}
        Email: {data['email']}
        Phone: {data['phone']}
        Message: {data['message']}
        '''
        mail.send(msg)
        
        return jsonify({'message': 'Contact form submitted successfully'}), 200
    
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    conn = get_db()
    c = conn.cursor()
    
    try:
        c.execute('SELECT * FROM testimonials WHERE approved = TRUE ORDER BY created_at DESC')
        testimonials = [dict(row) for row in c.fetchall()]
        return jsonify(testimonials), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/testimonials', methods=['POST'])
def submit_testimonial():
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'rating', 'comment']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        c.execute('''
            INSERT INTO testimonials (name, rating, comment)
            VALUES (?, ?, ?)
        ''', (data['name'], data['rating'], data['comment']))
        
        conn.commit()
        return jsonify({'message': 'Testimonial submitted successfully'}), 200
    
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
