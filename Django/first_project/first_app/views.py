from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def index(request):
    """This is the index view"""
    my_dict = {'insert_me': "Hello I am from views.py again!"}
    return render(request, 'first_app/index.html', context=my_dict)
