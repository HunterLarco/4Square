from google.appengine.ext.webapp import template
import webapp2
import os


class Main(webapp2.RequestHandler):
  def get(self):
    template_values = {}
    path = os.path.join(os.path.dirname(__file__), 'main.html')
    self.response.out.write(template.render(path, template_values))


class Beta(webapp2.RequestHandler):
  def get(self):
    template_values = {}
    path = os.path.join(os.path.dirname(__file__), 'beta.html')
    self.response.out.write(template.render(path, template_values))


app = webapp2.WSGIApplication([
                ('/beta/?', Beta),
                ('/.*', Main)
              ], debug=True)