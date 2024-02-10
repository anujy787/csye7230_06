from django.db import models

class SampleModel(models.Model):
    # CharField for a short text field
    name = models.CharField(max_length=100)

    # IntegerField for an integer field
    age = models.IntegerField()

    # EmailField for storing email addresses
    email = models.EmailField()

    # DateField for a date
    birthdate = models.DateField()

    # BooleanField for a boolean value
    is_active = models.BooleanField(default=True)

    # TextField for a longer text field
    description = models.TextField(blank=True, null=True)

    # DateTimeField for date and time
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name

    class Meta:
        # Specify the table name for the model
        db_table = 'user_model'
