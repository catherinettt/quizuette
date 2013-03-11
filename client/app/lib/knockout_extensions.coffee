ko.bindingHandlers.fadeVisible =
  init: (element, valueAccessor) ->

    # Initially set the element to be instantly visible/hidden depending on the value
    value = valueAccessor()
    $(element).toggle ko.utils.unwrapObservable(value) # Use "unwrapObservable" so we can handle values that may or may not be observable

  update: (element, valueAccessor) ->

    # Whenever the value subsequently changes, slowly fade the element in or out
    value = valueAccessor()
    (if ko.utils.unwrapObservable(value) then $(element).fadeIn() else $(element).fadeOut())