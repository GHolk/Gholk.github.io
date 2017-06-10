

function parseTable(tableNode) {
    var tableHeight = getTableHeight(tableNode)
    var tableWidth = getTableWidth(tableNode)
    var tableStructure = createTableBySize(tableHeight, tableWidth)
    forEachCellInTable(tableNode, function allocCell(cellNode, indexArray) {
	var n = indexArray[0], m = indexArray[1]
	for (var i=0; i<cellNode.rowSpan; i++) {
	    for (var j=0; j<cellNode.colSpan; j++) {
		setTableStartFrom(
		    tableStructure,
		    [n+i, m+j],
		    cellNode
		)
	    }
	}
    })
    return tableStructure
}

function createTableBySize(height, width) {
    var tableStructure = Array(height)
    for (var i=0; i<tableStructure.length; i++) {
	tableStructure[i] = Array(width)
    }
    return tableStructure
}

function setTableStartFrom(tableStructure, indexArray, setValue) {
    var n = indexArray[0], m = indexArray[1]
    while (tableStructure[n][m] != null) m++
    tableStructure[n][m] = setValue
}

function getTableHeight(tableNode) {
    var height = tableNode.rows.length
    return height
}

function getTableWidth(tableNode) {
    var width = 0
    forEachCellInRow(tableNode.rows[0], function incrementWidth(cellNode) {
	if (typeof cellNode.colSpan == 'number') {
	    width += cellNode.colSpan
	}
    })
    return width
}

function forEachCellInRow(rowNode, callback) {
    for (var i=0; i<rowNode.cells.length; i++) {
	callback(rowNode.cells[i], i)
    }
}
function forEachCellInTable(tableNode, callback) {
    for (var i=0; i<tableNode.rows.length; i++) {
	var currentRowNode = tableNode.rows[i]
	for (var j=0; j<currentRowNode.cells.length; j++) {
	    callback(currentRowNode.cells[j], [i,j])
	}
    }
}

