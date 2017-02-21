from django import forms
from captcha.fields import ReCaptchaField


class FeedbackForm(forms.Form):
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)
    captcha = ReCaptchaField()
