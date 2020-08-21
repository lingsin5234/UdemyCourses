from menu import Menu, MenuItem
from django.urls import reverse
from . import views as udemy_vw


Menu.add_item("udemy", MenuItem("My Portfolio", url="/", weight=10))
Menu.add_item("udemy", MenuItem("Project Info", reverse(udemy_vw.project_markdown), weight=10))
Menu.add_item("udemy", MenuItem("Mastering D3.js Course", reverse(udemy_vw.mastering_d3js), weight=10))
