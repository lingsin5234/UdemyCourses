from django.shortcuts import render
from djangoapps.utils import get_this_template


# project page
def project_markdown(request):

    page_height = 1050
    f = open('udemy/README.md', 'r')
    if f.mode == 'r':
        readme = f.read()
        page_height = len(readme) - 350

    content = {
        'readme': readme,
        'page_height': page_height
    }

    template_page = get_this_template('udemy', 'project.html')

    return render(request, template_page, content)


# Mastering D3.js Course
def mastering_d3js(request):

    return render(request, 'pages/masteringd3js.html')
