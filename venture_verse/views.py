from app.models import VerificationToken, Trip
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.http import HttpResponse


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


def accept_trip(request, id):
    id = id.split("@")
    trip = get_object_or_404(Trip, plan=id[0], user=id[1])
    trip.status = "Approved"
    trip.save()
    return HttpResponse("User Request Approved for the Trip!")


def reject_trip(request, id):
    id = id.split("@")
    trip = get_object_or_404(Trip, plan=id[0], user=id[1])
    trip.status = "Rejected"
    trip.save()
    return HttpResponse("User Request Rejected !")
