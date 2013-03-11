
module.exports = class PageRouter extends Backbone.Router
  constructor: (@page_el) ->
    HomeViewModel = require 'view_models/home'
    @route('', null, => @loadPage(kb.renderTemplate('views/home', new HomeViewModel())))

    ProductViewModel = require 'view_models/product'
    @route('product', null, => @loadPage(kb.renderTemplate('views/product', new ProductViewModel())))
    @route('product/mutuicars', null, => @loadPage(kb.renderTemplate('views/product_mutui_cars', new ProductViewModel())))
    @route('product/mutuituition', null, => @loadPage(kb.renderTemplate('views/product_mutui_tuition', new ProductViewModel())))

    AboutViewModel = require 'view_models/about'
    @route('about', null, => @loadPage(kb.renderTemplate('views/about', new AboutViewModel())))

  loadPage: (el) ->
    if @active_el # remove previous
        ko.removeNode(@active_el)
    return unless ((@active_el = el) and @page_el) # no new page
    $(@page_el).append(el)
    $(el).addClass('active')
