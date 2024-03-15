# csye7230_06
VentureVerse - turning solo adventures into shared experiences

APIS
Create a new travel plan: POST `/api/travel-plans/`
Join the pending list of a travel plan: POST `/api/travel-plans/<id>/join/`
Approve users from the pending list: POST `/api/travel-plans/<id>/approve/`
Update a travel plan (if you are the creator): PATCH `/api/travel-plans/<id>/`
Delete a travel plan (if you are the creator): DELETE `/api/travel-plans/<id>/`
View travel plan details (if you are a participant or the creator): GET `/api/travel-plans/<id>/`
Remember to replace <id> with the actual ID of the travel plan you want to interact with.
