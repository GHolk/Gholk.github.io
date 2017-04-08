
class TagsDataBase
    constructor: (path) ->
        @path = path
        @file = path.replace /^.*\//, ''
        @dataSet = JSON.parse fs.readFilsSync path, 'utf8'
    increment: (key, times = 1) ->
        if @dataSet
            @dataSet[key] += times
        else
            @dataSet[key] = times
    toString: ->
        JSON.stringify @dataSet
    write: (path = @path) ->
        fs.writeFileSync path, @toString(), 'utf8'
