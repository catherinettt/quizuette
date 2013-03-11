exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  paths:
    public: '../public/app'
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
        'test/javascripts/test.js': /^test(\/|\\)(?!vendor)/
        'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.before.
        before: [
          'vendor/scripts/jquery-1.8.2.js',
          'vendor/scripts/bootstrap-2.2.1.js',
          'vendor/scripts/underscore-1.4.0.js',
          'vendor/scripts/backbone-0.9.2.js',
          'vendor/scripts/backbone-relational-0.6.0.js',
          'vendor/scripts/knockout-2.1.0.js',
          'vendor/scripts/knockback-0.16.7.js'
        ]

    stylesheets:
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
        'test/stylesheets/test.css': /^test/
      order:
        before: [
          'vendor/styles/normalize-1.0.1.css'
          'vendor/styles/helpers.css'
          'vendor/styles/bootstrap.css'
          'vendor/styles/bootstrap-responsive.css'
        ]

    templates:
      joinTo: 'javascripts/app.js'
