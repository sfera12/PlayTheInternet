_.flatten(_.reduce(sortedData, function (memo, item) {
    _.each(item.data, function (item) {
        item.date = this.meta.date
    }, item)
    memo.push(item.data);
    return memo
}, new Array()))

