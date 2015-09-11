ko.bindingHandlers["combogridSource"] = <KnockoutBindingHandler>{
    init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        var $combogrid = utils.component.initComponent(element, "combogrid", allBindingsAccessor)
        var options = $combogrid["combogrid"]('options')
        var onLoadSuccess = options.onLoadSuccess
        options.onLoadSuccess = function (data) {
            var source = valueAccessor()
            source(data.rows)
            if (onLoadSuccess) {
                onLoadSuccess.apply($(element), arguments)
            }
            utils.component.bindDisposeEvent(element, "combogrid")
        }
    },
    update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        var values = ko.utils.unwrapObservable(valueAccessor())
        var options = $(element)["combogrid"]("options")
        var idSelector = (item) => item[options.idField]
        var currentValues = $(element)["combogrid"]('grid').datagrid('getData').rows
        if (!utils.array.sequenceEqual(currentValues, values, idSelector))
            $(element)["combogrid"]('grid').datagrid('loadData', values)
    }
}

ko.bindingHandlers["combogridValues"] = <KnockoutBindingHandler>{
    init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        utils.component.ensureComponentInited(element, "combogrid", allBindingsAccessor, { multiple: true })
        var curValues = $(element)["combogrid"]('getValues') //������ʼ������Ĭ��ѡ��""������
        if (utils.array.all(curValues, (item) => !item)) {
            $(element)["combogrid"]('setValues', [])
        }
        var values = valueAccessor()
        if (!values() || values().length === 0) { //���û��Ĭ��ֵ�����ʼ��Ϊ��ǰcombobox��ֵ
            curValues = $(element)["combogrid"]('getValues')
            if (curValues) {
                values(curValues)
            }
        }
        var $grid = $(element)["combogrid"]("grid")
        var options = $(element)["combogrid"]('options')
        var gridOptions = $grid.datagrid('options')
        var comboOptions = $(element)["combo"]("options")
        options.multiple = true
        gridOptions.singleSelect = false //��������õĻ���Ч����ʵ�����Ǹ�����û����
        var refreshValueFun = (oriFun) =>
            function () {
                var newValueIds = $(element)["combogrid"]('getValues')
                if (!utils.array.sequenceEqual(values(), newValueIds, utils.id)) {
                    values(newValueIds)
                    if (oriFun) {
                        oriFun.apply($(element), arguments)
                    }
                }
            }
        comboOptions.onChange = refreshValueFun(comboOptions.onChange) //combogridִ�е���combo�ϵ�onChange
        utils.component.bindDisposeEvent(element, "combogrid")
    },
    update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        //var values = (utils.convertToString(v) for v in ko.utils.unwrapObservable(valueAccessor()))
        var values = utils.array.map(ko.utils.unwrapObservable(valueAccessor()), (v) => utils.convertToString(v))
        var oriValues = $(element)["combogrid"]('getValues')
        var options = $(element)["combogrid"]("options")
        //���δ�޸ģ��򲻱ظ���
        if (values) {
            if (!utils.array.sequenceEqual(oriValues, values, utils.id))
                $(element)["combogrid"]('setValues', values)
        }
        else {
            $(element)["combogrid"]('clear')
        }
    }
}

ko.bindingHandlers["combogridValue"] = <KnockoutBindingHandler>{
    init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        utils.component.ensureComponentInited(element, "combogrid", allBindingsAccessor, { multiple: false })
        var value = valueAccessor()
        if (!value()) {
            var curValue = $(element)["combogrid"]('getValue')
            if (curValue)
                value(curValue)
        }
        var $grid = $(element)["combogrid"]("grid")
        var options = $(element)["combogrid"]('options')
        var gridOptions = $grid.datagrid('options')
        var comboOptions = $(element)["combo"]("options")
        options.multiple = false
        gridOptions.singleSelect = true //��������õĻ���Ч����ʵ�����Ǹ�����û����
        var refreshValueFun = (oriFun) =>
            function () {
                var newValueId = $(element)["combogrid"]('getValue')
                if (value() !== newValueId) {
                    value(newValueId)
                    if (oriFun) {
                        oriFun.apply($(element), arguments)
                    }
                }
            }
        comboOptions.onChange = refreshValueFun(comboOptions.onChange)
        utils.component.bindDisposeEvent(element, "combogrid")
    },
    update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        var value = utils.convertToString(ko.utils.unwrapObservable(valueAccessor()))
        var oriValue = $(element)["combogrid"]('getValue')
        var options = $(element)["combogrid"]("options")
        //���δ�޸ģ��򲻱ظ���
        if (value) {
            if (oriValue !== value)
                $(element)["combogrid"]('setValue', value)
        }
        else {
            $(element)["combogrid"]('clear')
        }
    }
}