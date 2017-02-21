from tacnet.apps.frontpage.forms import FeedbackForm


def feedbackForm(request):
    return {
        'feedbackForm': FeedbackForm()
    }
