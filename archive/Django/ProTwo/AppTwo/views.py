from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    '''This is the index view.'''
    return HttpResponse('<em>My Second App</em>')

def help(request):
    '''This is the help view.'''
    my_dict = {'insert_me': 'Never Fear, Django is here!'}
    return render(request, 'AppTwo/help.html', context=my_dict)
