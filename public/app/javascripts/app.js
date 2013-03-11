(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("config", function(exports, require, module) {
  

  
});
window.require.register("initialize", function(exports, require, module) {
  var TemplateEngine;

  TemplateEngine = require('lib/require_template_engine');

  ko.setTemplateEngine(new TemplateEngine());

  window.ApplicationViewModel = require('view_models/application');
  
});
window.require.register("lib/knockout_extensions", function(exports, require, module) {
  
  ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
      var value;
      value = valueAccessor();
      return $(element).toggle(ko.utils.unwrapObservable(value));
    },
    update: function(element, valueAccessor) {
      var value;
      value = valueAccessor();
      if (ko.utils.unwrapObservable(value)) {
        return $(element).fadeIn();
      } else {
        return $(element).fadeOut();
      }
    }
  };
  
});
window.require.register("lib/require_template_engine", function(exports, require, module) {
  var RequireTemplateEngine, RequireTemplateSource,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RequireTemplateSource = (function() {

    function RequireTemplateSource(template, binding_context) {
      this.template = template;
      this.binding_context = binding_context != null ? binding_context : {};
    }

    RequireTemplateSource.prototype.data = function(key, value) {
      if (arguments.length === 1) {
        return this.binding_context[key];
      }
      return this.binding_context[key] = value;
    };

    RequireTemplateSource.prototype.text = function() {
      if (arguments.length > 0) {
        throw 'TemplateSource: unexpected writing to template source';
      }
      return this.template(this.binding_context);
    };

    return RequireTemplateSource;

  })();

  module.exports = RequireTemplateEngine = (function(_super) {

    __extends(RequireTemplateEngine, _super);

    function RequireTemplateEngine() {
      this.allowTemplateRewriting = false;
    }

    RequireTemplateEngine.prototype.makeTemplateSource = function(template_name) {
      var template;
      try {
        template = require(template_name);
      } catch (e) {

      }
      if (template) {
        return new RequireTemplateSource(template);
      } else {
        return RequireTemplateEngine.__super__.makeTemplateSource.apply(this, arguments);
      }
    };

    RequireTemplateEngine.prototype.renderTemplateSource = function(template_source, binding_context, options) {
      var key, value;
      for (key in binding_context) {
        value = binding_context[key];
        template_source.data(key, value);
      }
      return RequireTemplateEngine.__super__.renderTemplateSource.apply(this, arguments);
    };

    return RequireTemplateEngine;

  })(ko.nativeTemplateEngine);
  
});
window.require.register("router", function(exports, require, module) {
  var PageRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = PageRouter = (function(_super) {

    __extends(PageRouter, _super);

    function PageRouter(page_el) {
      var AboutViewModel, HomeViewModel, ProductViewModel,
        _this = this;
      this.page_el = page_el;
      HomeViewModel = require('view_models/home');
      this.route('', null, function() {
        return _this.loadPage(kb.renderTemplate('views/home', new HomeViewModel()));
      });
      ProductViewModel = require('view_models/product');
      this.route('product', null, function() {
        return _this.loadPage(kb.renderTemplate('views/product', new ProductViewModel()));
      });
      this.route('product/mutuicars', null, function() {
        return _this.loadPage(kb.renderTemplate('views/product_mutui_cars', new ProductViewModel()));
      });
      this.route('product/mutuituition', null, function() {
        return _this.loadPage(kb.renderTemplate('views/product_mutui_tuition', new ProductViewModel()));
      });
      AboutViewModel = require('view_models/about');
      this.route('about', null, function() {
        return _this.loadPage(kb.renderTemplate('views/about', new AboutViewModel()));
      });
    }

    PageRouter.prototype.loadPage = function(el) {
      if (this.active_el) {
        ko.removeNode(this.active_el);
      }
      if (!((this.active_el = el) && this.page_el)) {
        return;
      }
      $(this.page_el).append(el);
      return $(el).addClass('active');
    };

    return PageRouter;

  })(Backbone.Router);
  
});
window.require.register("view_models/about", function(exports, require, module) {
  var AboutViewModel;

  module.exports = AboutViewModel = (function() {

    function AboutViewModel() {}

    return AboutViewModel;

  })();
  
});
window.require.register("view_models/application", function(exports, require, module) {
  var ApplicationViewModel, PageRouter;

  PageRouter = require('router');

  module.exports = ApplicationViewModel = (function() {

    function ApplicationViewModel() {
      _.bindAll(this, 'afterBinding', 'hoverInLogo', 'hoverOutLogo');
    }

    ApplicationViewModel.prototype.afterBinding = function(vm, el) {
      var $el, application_page_el;
      $el = $(el);
      application_page_el = kb.renderTemplate('views/application', this);
      $el.append(application_page_el);
      new PageRouter($el.find('#pages')[0]);
      return Backbone.history.start({
        hashChange: true
      });
    };

    ApplicationViewModel.prototype.hoverInLogo = function() {
      return $('.logo').attr('src', './images/coppio_blue.png');
    };

    ApplicationViewModel.prototype.hoverOutLogo = function() {
      return $('.logo').attr('src', './images/coppio.png');
    };

    ApplicationViewModel.prototype.showProduct = function() {
      return this.product(true);
    };

    return ApplicationViewModel;

  })();
  
});
window.require.register("view_models/home", function(exports, require, module) {
  var HomeViewModel;

  module.exports = HomeViewModel = (function() {

    function HomeViewModel() {}

    return HomeViewModel;

  })();
  
});
window.require.register("view_models/product", function(exports, require, module) {
  var ProductViewModel;

  module.exports = ProductViewModel = (function() {

    function ProductViewModel() {}

    return ProductViewModel;

  })();
  
});
window.require.register("views/about", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<br/><div class="row-fluid"><div class="span3"><h3>Dev</h3><span>Dan</span><br/><span>[ dan at coppio dot com ]</span></div><div class="span3"><h3>Design</h3><span>Cat</span><br/><span>[ cat at coppio dot com ]</span></div></div><br/><p>For general inquries please email us at [ support at coppio dot com ]</p>');
  }
  return buf.join("");
  };
});
window.require.register("views/application", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="pages" class="container-fluid"></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/header", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="container-fluid"><div class="row-fluid"><a href="" class="span6"><img src="./images/coppio.png" data-bind="event: {mouseover: hoverInLogo, mouseout: hoverOutLogo}" class="logo"/></a><div class="span6"><menu class="row-fluid"><li> <a href="#product">PRODUCTS</a></li><li> <a href="#about">ABOUT</a></li></menu></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  }
  return buf.join("");
  };
});
window.require.register("views/product", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="product"><div class="row-fluid"><div class="span3"><a href="#product/mutuicars"><img src="./images/mutui_cars/ic_launcher.png"/></a></div><div class="span3"><a href="#product/mutuituition"><img src="./images/mutui_tuition/ic_launcher.png"/></a></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/product_mutui_cars", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="row-fluid"><div class="span6"><img src="./images/mutui_cars/feature.jpg"/><div><br/><p>Mutui Cars is your all-in-one car loan calculator! It is easy to use and designed for car shoppers and dealers! With Mutui Cars, you can save, edit and compare the price of each vehicles to help make that important decision.</p><a href="https://t.co/2Lg5b6np" target="_blank" class="pull-right btn btn-inverse">View on Google Play</a></div></div><div class="span6 mutui-gallery"><div class="mutui-gallery-box"><img src="./images/mutui_cars/main.png" class="img-polaroid"/><img src="./images/mutui_cars/summary.png" class="img-polaroid"/><img src="./images/mutui_cars/list.png" class="img-polaroid"/><img src="./images/mutui_cars/calculate.png" class="img-polaroid"/><img src="./images/mutui_cars/economy.png" class="img-polaroid"/><img src="./images/mutui_cars/affordability.png" class="img-polaroid"/></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/product_mutui_tuition", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="row-fluid"><div class="span6"><img src="./images/mutui_tuition/feature.png"/><a href="https://play.google.com/store/apps/details?id=com.coppio.tuition" target="_blank" class="btn pull-right btn-inverse">View on Google Play</a></div><div class="span6 mutui-gallery"><div class="mutui-gallery-box"><img src="./images/mutui_tuition/title.png" class="img-polaroid"/><img src="./images/mutui_tuition/main.png" class="img-polaroid"/></div></div></div>');
  }
  return buf.join("");
  };
});
