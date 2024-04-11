from app.models import VerificationToken
from django.http import JsonResponse


def verify_email(request):
    token = request.GET.get("token")

    if token:
        if VerificationToken.verify_user(token):
            return JsonResponse(
                {"status": "success", "message": "Email verified successfully"}
            )
        else:
            return JsonResponse({"status": "error", "message": "Invalid token"})
    else:
        return JsonResponse({"status": "error", "message": "Token not provided"})
