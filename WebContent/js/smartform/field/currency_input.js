try{
SmartWorks.FormRuntime = SmartWorks.FormRuntime || {};

SmartWorks.FormRuntime.CurrencyInputBuilder = {};

SmartWorks.FormRuntime.CurrencyInputBuilder.build = function(config) {
	var options = {
		mode : 'edit', // view or edit
		container : $('<div></div>'),
		entity : null,
		dataField : '',
		refreshData : false,
		layoutInstance : null,
		isDataGrid : false
	};

	SmartWorks.extend(options, config);
	if(!options.refreshData)
		options.container.html('');

	var value = (options.dataField==null || isEmpty(options.dataField.value)) ? '' : parseFloat(options.dataField.value);
	var $entity = options.entity;
	var $graphic = $entity.find('graphic');
	
	var readOnly = $graphic.attr('readOnly') === 'true' || options.mode === 'view';
	var id = $entity.attr('id');
	var name = $entity.attr('name');
	
	var currency = $entity.children('format').children('currency').text();

	var labelWidth = (isEmpty(options.layoutInstance)) ? parseInt($graphic.attr('labelWidth')) : options.layoutInstance.getLabelWidth(id);
	var valueWidth = 100 - (options.isDataGrid ? 0 : labelWidth);
	var $label = $('<div class="form_label" style="width:' + labelWidth + '%"><span>' + name + '</span></div>');
	var required = $entity.attr('required');
	if(required === 'true' && !readOnly){
		$label.addClass('required_label');
		required = " class='js_currency_input fieldline tr sw_required' ";
	}else{
		required = " class='js_currency_input fieldline tr' ";
	}
	if(!options.refreshData && !options.isDataGrid)
		$label.appendTo(options.container);
	
	
	var $currency = null;
	if(readOnly){
		if(value==='')
			$currency = $('<div class="form_value form_number_input tr" style="width:' + valueWidth + '%"><span>&nbsp;</span></div>');
		else
			//$currency = $('<div class="form_value form_number_input" style="width:' + valueWidth + '%"><span>' + $(value).formatCurrency({ symbol: currency ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true }) + '</span></div>').find('span');
			$currency = $('<div class="form_value form_number_input tr" style="width:' + valueWidth + '%"><span>'+value+'</span></div>');
		$currency.find('span').formatCurrency({ symbol: currency ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
	}else{	
		$currency = $('<div name="' + id + '" class="form_value form_number_input" style="width:' + valueWidth + '%"><input type="text" symbol="' + currency + '"'  + required + '></div>');
		if(value!=='')
			$currency.find('input').attr('value',value).formatCurrency({ symbol: currency ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
		$currency.attr('title', $entity.attr('toolTip'));
	}
	if ($graphic.attr('hidden') == 'true'){
		options.container.hide();
	}
	
	if(!options.refreshData){
		$currency.appendTo(options.container);
	}else if(value!==''){
		if(readOnly)
			options.container.find('.form_value span').text(value).formatCurrency({ symbol: currency ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
		else
			options.container.find('.form_value input').attr('value', value).formatCurrency({ symbol: currency ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
	}
	
	if (readOnly) {
		var $currencyHiddenInput = options.container.find('#currencyHiddenInput'+id);
		if ($currencyHiddenInput.length === 0) {
			options.container.append('<input id="currencyHiddenInput'+id+'" type="hidden" name="' + id + '" value="' + value + '">');
		} else {
			$currencyHiddenInput.attr('value', value);
		}
	}

	var isHidden =  (options.dataField && options.dataField.isHidden) || null;
	var isReadOnly =  (options.dataField && options.dataField.isReadOnly) || null;
	var isRequired =  (options.dataField && options.dataField.isRequired) || null;
	if(options.refreshData && (isHidden || isRequired || isReadOnly)){
		var formLabel = options.container.find('.form_label:first');
		var formValue = options.container.find('.form_value:first');
		if(isHidden == 'true'){
			options.container.hide();
		}else if(isHidden == 'false'){
			options.container.show().parent().show();
		}
		
		if(options.mode == 'edit'){
			if(isReadOnly == 'true'){
				if(value==='')
					formValue.html('<span>&nbsp;</span>');
				else
					formValue.html('<span>'+value+'</span>');
				formValue.addClass('tr');
				formValue.find('span').formatCurrency({ symbol: currency ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
				var $currencyHiddenInput = $('#currencyHiddenInput'+id);
				if ($currencyHiddenInput.length === 0) {
					options.container.append('<input id="currencyHiddenInput'+id+'" type="hidden" name="' + id + '" value="' + value + '">');
				} else {
					$currencyHiddenInput.attr('value', value);
				}
				formValue.removeAttr('title');
				formLabel.removeClass('required_label');
			}else if(isReadOnly == 'false'){			
				formValue.html('<input type="text" symbol="' + currency + '"'  + required + '>');
				if(value!=='')
					formValue.find('input').attr('value',value).formatCurrency({ symbol: currency ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
				$('#currencyHiddenInput'+id).remove();
				formValue.attr('title', $entity.attr('toolTip'));
				if($entity.attr('required') === 'true')
					formLabel.addClass('required_label');
			}
				
			if(isRequired == 'true'){
				formLabel.addClass('required_label');
				formValue.find('input').addClass('sw_required');
			}else if(isRequired == 'false'){
				formLabel.removeClass('required_label');
				formValue.find('input').removeClass('sw_required');			
			}
		}
	}else if(isHidden){
		if(isHidden == 'true'){
			options.container.hide();
		}else if(isHidden == 'false'){
			options.container.show().parent().show();
		}		
	}

	return options.container;
};

SmartWorks.FormRuntime.CurrencyInputBuilder.buildEx = function(config){
	var options = {
			container : $('<tr></tr>'),
			fieldId: '',
			fieldName: '',
			value: '',
			columns: 1,
			colSpan: 1, 
			required: false,
			readOnly: false		
	};
	SmartWorks.extend(options, config);

	var labelWidth = 12;
	if(options.columns >= 1 && options.columns <= 4 && options.colSpan <= options.columns) labelWidth = 12 * options.columns/options.colSpan;
	$formEntity =  $($.parseXML('<formEntity id="' + options.fieldId + '" name="' + options.fieldName + '" systemType="string" required="' + options.required + '" system="false">' +
						'<format type="currencyInput" viewingType="currencyInput"/>' +
					    '<graphic hidden="false" readOnly="'+ options.readOnly +'" labelWidth="'+ labelWidth + '"/>' +
					'</formEntity>')).find('formEntity');
	var $formCol = $('<td class="form_col js_type_currenyInput" fieldid="' + options.fieldId+ '" colspan="' + options.colSpan + '" width="' + options.colSpan/options.columns*100 + '%" rowspan="1">');
	$formCol.appendTo(options.container);
	SmartWorks.FormRuntime.CurrencyInputBuilder.build({
			mode : options.readOnly, // view or edit
			container : $formCol,
			entity : $formEntity,
			dataField : SmartWorks.FormRuntime.CurrencyInputBuilder.dataField({
					fieldId: options.fieldId,
					value: options.value
			})
	});
	
};

$('input.js_currency_input').live('keyup', function(e) {
	var e = window.event || e;
	var keyCode = e.which || e.keyCode;
	var keyUnicode = e.charCode || e.keyCode;
	if (e !== undefined) {
		switch (keyUnicode) {
			case 16: break; // Shift
			case 17: break; // Ctrl
			case 18: break; // Alt
			case 27: this.value = ''; break; // Esc: clear entry
			case 35: break; // End
			case 36: break; // Home
			case 37: break; // cursor left
			case 38: break; // cursor up
			case 39: break; // cursor right
			case 40: break; // cursor down
			case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
			case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
			case 190: break; // .
			default:
				if($(this).attr('value') === $(this).attr('symbol') + '0-') $(this).attr('value', '-');				
				var value = $(this).attr('value');
				var firstStr = value.substring(0,1);
				var secondStr = value.substring(1,2);
				var thirdStr = value.substring(2,3);
				if(isEmpty(value) 
						|| (firstStr !== $(this).attr('symbol') && firstStr !== '-' && (firstStr<'0' || firstStr>'9')) 
						|| (firstStr === $(this).attr('symbol') && (secondStr<'0' || secondStr>'9'))
						|| (firstStr === '-' && !isEmpty(secondStr) && secondStr!==$(this).attr('symbol')  && secondStr!=='.' && (secondStr<'0' || secondStr>'9')) 
						|| (firstStr === '-' && secondStr===$(this).attr('symbol') && (thirdStr<'0' || thirdStr>'9'))) 
					$(this).attr('value', 0);
				$(this).formatCurrency({ symbol: $(this).attr('symbol') ,colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
		}
	}
	
});


SmartWorks.FormRuntime.CurrencyInputBuilder.dataField = function(config){
	var options = {
			fieldName: '',
			formXml: '',
			fieldId: '',
			value: ''
	};

	SmartWorks.extend(options, config);
	$formXml = isEmpty(options.formXml) ? [] : $($.parseXML(options.formXml)).find('form');
	var dataField = {};
	var fieldId = (isEmpty(options.fieldId)) ? $formXml.find('formEntity[name="'+options.fieldName+'"]').attr('id') : options.fieldId;
	if(isEmpty(fieldId)) fieldId = ($formXml.attr("name") === options.fieldName) ? $formXml.attr('id') : "";
	if(isEmpty(fieldId)) return dataField;
	
	dataField = {
			id: fieldId,
			value: options.value
	};
	return dataField;
};

SmartWorks.FormRuntime.CurrencyInputBuilder.serializeObject = function(currencyInputs){
	var currencyInputsJson = {};
	for(var i=0; i<currencyInputs.length; i++){
		var currencyInput = $(currencyInputs[i]);
//		if(!isEmpty(currencyInput.parents('td.js_type_dataGrid'))) continue;
		var valueStr = currencyInput.find('input').attr('value');
		currencyInputsJson[currencyInput.attr('fieldId')] = isEmpty(valueStr) ? '' : $.parseNumber( valueStr, {format:"-0,000.0", locale: currentUser.locale });
	}
	return currencyInputsJson;
};

SmartWorks.FormRuntime.CurrencyInputBuilder.validate = function(currencyInputs){
	var currencyInputsValid = true;
	for(var i=0; i<currencyInputs.length; i++){
		var currencyInput = $(currencyInputs[i]);
		var input = currencyInput.find('input.sw_required');
		if(isEmpty(input)) continue;
		if(isEmpty(input.attr('value'))){
			input.addClass("sw_error");
			currencyInputsValid = false;
		}
	}
	return currencyInputsValid;
};
}catch(error){
	smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[currency_input script]', null, error);
}