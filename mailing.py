import requests
from django.conf import settings
from configparser import ConfigParser

config = ConfigParser()
config.read("config.ini")
# Initialize a session for HTTP requests
session = requests.Session()
api_key = config.get("mailgun", "api_key")

session.auth = ("api", api_key)


def send_simple_message(email, subject, message):
    """Send an email using the Mailgun API."""
    try:
        response = session.post(
            "https://api.mailgun.net/v3/anujscloud.me/messages",
            data={
                "from": "Venture Verse <admin@anujscloud.me>",
                "to": [email],
                "subject": subject,
                "text": message,
            },
        )
        response.raise_for_status()
        if response.status_code == 200:
            print(f"Verification email successfully sent to {email}")
        return response.json()
    except requests.RequestException as e:
        print(f"Failed to send email to {email}: {e}")
        return None


def send_verification_email(email, token, baseurl=settings.BASE_URL):
    """Constructs and sends the verification email."""
    subject = "Welcome to VentureVerse - Verify your email"
    message = f"Click the following link within 1 Day to verify your email: {baseurl}/verify?token={token}"
    response = send_simple_message(email, subject, message)
    if response and response.get("id"):
        print(response)
    else:
        print(f"Failed to send verification email to {email}")
