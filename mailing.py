import requests
from django.conf import settings
from configparser import ConfigParser

config = ConfigParser()
config.read("config.ini")
# Initialize a session for HTTP requests
session = requests.Session()
api_key = config.get("mailgun", "api_key")

session.auth = ("api", api_key)


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
    baseurl = settings.BASE_URL
    subject = "Welcome to VentureVerse - Verify your email"
    message = f"Click the following link within 1 Day to verify your email: {baseurl}/verify?token={token}"
    response = send_simple_message(email, subject, message=message)
    if response and response.get("id"):
        print(response)
    else:
        print(f"Failed to send verification email to {email}")


def send_trip_invite(user, serializer):
    serializer_data = serializer
    email = user.email
    subject = f"Hey {user.first_name} {user.last_name}, Find Your Trip Details "
    for plan_details in serializer_data:

        html_content = "<html><head></head><body>"
        for key, value in plan_details.items():

            html_content += (
                f'<p><strong>{key.replace("_", " ").title()}:</strong> {value}</p>'
            )

        html_content += "</body></html>"

        return send_simple_message(email, subject, html_message=html_content)
