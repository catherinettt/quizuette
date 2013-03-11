# template source
class RequireTemplateSource
  constructor: (@template, @binding_context={}) ->

  data: (key, value) ->
    return @binding_context[key] if arguments.length is 1
    @binding_context[key] = value

  text: ->
    throw 'TemplateSource: unexpected writing to template source' if (arguments.length > 0)
    return @template(@binding_context)

# template engine
module.exports = class RequireTemplateEngine extends ko.nativeTemplateEngine
  constructor: ->
    @allowTemplateRewriting = false

  makeTemplateSource: (template_name) ->
    try (template = require(template_name)) catch e # see if we can load the template
    return if template then new RequireTemplateSource(template) else super

  renderTemplateSource: (template_source, binding_context, options) ->
    template_source.data(key, value) for key, value of binding_context
    return super