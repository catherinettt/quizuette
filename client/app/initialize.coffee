# configure template engine
TemplateEngine = require 'lib/require_template_engine'
ko.setTemplateEngine(new TemplateEngine())


# export the application view model so can be bound in index.html
window.ApplicationViewModel = require 'view_models/application'
