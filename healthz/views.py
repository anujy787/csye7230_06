from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt


class HealthzView(View):

    @method_decorator(never_cache)
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        if request.method == "GET" and not request.body and not request.GET:
            return HttpResponse(status=200)
        else:
            return HttpResponseBadRequest(status=405)
