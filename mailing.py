import requests
from django.conf import settings
from configparser import ConfigParser
from app.models import User
from app.serializers import UserSerializer


config = ConfigParser()
config.read("config.ini")

session = requests.Session()
api_key = config.get("mailgun", "api_key")

session.auth = ("api", api_key)
baseurl = settings.BASE_URL


def send_simple_message(email, subject, message=None, html_message=None):
    """Send an email using the Mailgun API."""
    try:
        response = session.post(
            "https://api.mailgun.net/v3/anujscloud.me/messages",
            data={
                "from": "Venture Verse <admin@anujscloud.me>",
                "to": [email],
                "subject": subject,
                "text": message,
                "html": html_message,
            },
        )
        response.raise_for_status()
        if response.status_code == 200:
            print(f"Verification email successfully sent to {email}")
        return response.json()
    except requests.RequestException as e:
        print(f"Failed to send email to {email}: {e}")
        return None


def send_verification_email(email, token):
    """Constructs and sends the verification email."""
    subject = "Welcome to VentureVerse - Verify your email"
    message = f"Click the following link within 1 Day to verify your email: {baseurl}/verify?token={token}"
    response = send_simple_message(email, subject, message=message)
    if response and response.get("id"):
        print(response)
    else:
        print(f"Failed to send verification email to {email}")


def send_trip_invite(owner, plan, user, plan_id, req_user_id):

    accept_url = f"{baseurl}/trip/{plan_id}@{req_user_id}/accept/"
    reject_url = f"{baseurl}/trip/{plan_id}@{req_user_id}/reject/"
    subject = f"Hey {owner}, You have a Trip Approval Request"
    html_content = f"""
        <html>
        <body>
            <p>Hello, {owner} </p>
            <p>You have a trip awaiting approval from {user}:</p>
            <p><strong>Trip Name:</strong> {plan}</p>
            <p><strong>Accept:</strong> <a href="{accept_url}">Accept</a></p>
            <p><strong>Reject:</strong> <a href="{reject_url}">Reject</a></p>
        </body>
        </html>
    """
    import pdb

    pdb.set_trace()
    return send_simple_message(owner, subject, html_message=html_content)
