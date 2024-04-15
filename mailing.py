import requests
from django.conf import settings
from configparser import ConfigParser
import os
from django.conf import settings

base_url = settings.BASE_URL


def load_config():
    config = ConfigParser()
    config.read("config.ini")
    return config


def create_mailgun_session():
    config = load_config()
    api_key = config.get("mailgun", "api_key")
    session = requests.Session()
    session.auth = ("api", api_key)
    return session


session = create_mailgun_session()


# General function to send emails using HTML templates
def send_email(email, subject, template_name, **context):

    template_path = os.path.join("templates", f"{template_name}.html")
    try:
        with open(template_path, "r") as file:
            html_template = file.read()
        html_content = html_template.format(**context)

        response = session.post(
            "https://api.mailgun.net/v3/anujscloud.me/messages",
            data={
                "from": "Venture Verse <admin@anujscloud.me>",
                "to": [email],
                "subject": subject,
                "html": html_content,
            },
        )
        response.raise_for_status()
        if response.status_code == 200:
            print(f"Email successfully sent to {email}")
        return response.json()
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")
        return None


# Specific email functionalities
def send_verification_email(email, token):
    verification_link = f"{settings.BASE_URL}/verify?token={token}"
    subject = "Welcome to VentureVerse - Verify your email"
    context = {
        "verification_link": verification_link,
    }
    return send_email(email, subject, "verification_email_template", **context)


def send_trip_invite(owner, plan, user, plan_id, req_user_id):
    accept_url = f"{settings.BASE_URL}/trip/{plan_id}@{req_user_id}/accept/"
    reject_url = f"{settings.BASE_URL}/trip/{plan_id}@{req_user_id}/reject/"
    subject = f"Hey {owner}, You have a Trip Approval Request"
    context = {
        "owner": owner,
        "user": user,
        "plan": plan,
        "accept_url": accept_url,
        "reject_url": reject_url,
    }
    return send_email(owner, subject, "trip_approval_template", **context)
