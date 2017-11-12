
function Cell(cell) {
    this.node = cell
    this.value = $(cell).text()
}

function parseTable(tableNode) {
    var tableHeight = getTableHeight(tableNode)
    var tableWidth = getTableWidth(tableNode)
    var tableStructure = createTableBySize(tableHeight, tableWidth)
    forEachCellInTable(tableNode, function allocCell(cellNode, indexArray) {
        var n = indexArray[0], m = indexArray[1]
        var $cell = $(cellNode)
        var rowSpan = $cell.prop('rowSpan')
        var colSpan = $cell.prop('colSpan')
        var cell = new Cell(cellNode)
        for (var i=0; i<rowSpan; i++) {
            for (var j=0; j<colSpan; j++) {
                setTableStartFrom(
                    tableStructure,
                    [n+i, m+j],
                    cell
                )
            }
        }
    })
    return tableStructure
}

function createTableBySize(height, width) {
    var tableStructure = new Array(height)
    for (var i=0; i<tableStructure.length; i++) {
    tableStructure[i] = Array(width)
    }
    return tableStructure
}

function setTableStartFrom(tableStructure, indexArray, setValue) {
    var n = indexArray[0], m = indexArray[1]
    while (tableStructure[n][m]) m++
    tableStructure[n][m] = setValue
}

function getTableHeight(tableNode) {
    return $(tableNode).find('tr').length
}

function getTableWidth(tableNode) {
    var width = 0
    forEachCellInRow(tableNode.rows[0], function incrementWidth(cellNode) {
    if (typeof cellNode.colSpan == 'number') {
        width += cellNode.colSpan
    }
    })
    return $(tableNode).find('tr').first().find('th,td').length
}

function forEachCellInRow(rowNode, callback) {
    $(rowNode).find('th,td').each(function eachCell(cellIndex) {
        callback(this, cellIndex)
    })
}

function forEachCellInTable(tableNode, callback) {
    $(tableNode).find('tr').each(function eachRow(rowIndex) {
        $(this).find('th,td').each(function eachCell(cellIndex) {
            callback(this, [rowIndex, cellIndex])
        })
    })
}

