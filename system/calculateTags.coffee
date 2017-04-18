
class TagsDataBase
    constructor: (path) ->
        @path = path
        @file = path.replace /^.*\//, ''
        @dataSet = JSON.parse fs.readFileSync path, 'utf8'
    increment: (key, times = 1) ->
        if @dataSet[key]
            @dataSet[key] += times
        else
            @dataSet[key] = times
    toString: ->
        JSON.stringify @dataSet
    write: (path = @path) ->
        fs.writeFileSync path, @toString(), 'utf8'
    updateFromLoader: (loader) ->
        for tag in loader.tags.split /,/g
            this.increment tag


module.exports = TagsDataBase

