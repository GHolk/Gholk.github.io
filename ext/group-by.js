
function groupByArray(array, groupFunction) {
    var map = {}
    array.forEach(
    function forEachFunction(item, index, array) {
        var groupName = groupFunction(item, index, array)
        if (map[groupName]) map[groupName].push(item)
        else map[groupName] = [item]
    })
    return map
}

Array.prototype.groupBy = function groupBy(groupFunction) {
    return groupByArray(this, groupFunction)
}
